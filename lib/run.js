const { execSync } = require('child_process');
const { createClient } = require('@supabase/supabase-js');
const { default: PQueue } = require('p-queue');

const queue = new PQueue({ concurrency: 10 });

const exec = (cmd) => {
  execSync(cmd, { stdio: [0, 1, 2] });
};

const getStorageObjects = async (supabase, bucketName, folderName = '', offset = 0) => {
  const { data, error } = await await supabase
    .storage
    .from(bucketName)
    .list(folderName, {
      limit: 100,
      offset,
    });

  if (error) {
    throw new Error(error.message);
  }

  const files = data
    .filter(({ metadata }) => !!metadata)
    .map((file) => ({ ...file, bucketName, folderName }));

  const folders = data.filter(({ metadata }) => !metadata);
  const subFiles = [].concat(...await Promise.all(folders.map(async (folder) => (
    getStorageObjects(
      supabase,
      bucketName,
      [folderName, folder.name].filter((x) => x).join('/'),
      offset,
    )
  ))));

  if (subFiles.length) {
    files.push(...subFiles);
  }

  if (data.length) {
    files.push(...(await getStorageObjects(
      supabase,
      bucketName,
      folderName,
      data.length + offset,
    )));
  }

  return files;
};

const transferObject = async (
  oldSupabaseClient,
  newSupabaseClient,
  object,
  newObjects,
) => {
  const objectPath = `${object.folderName}/${object.name}`;
  const objectExists = newObjects.some((newObject) => (
    newObject.name === object.name
    && newObject.folderName === object.folderName
    && newObject.bucketName === object.bucketName
    && newObject.metadata.size === object.metadata.size
  ));

  if (objectExists) {
    console.log(`Skipping already existing object: ${objectPath}`);

    return;
  }

  console.log(`Moving object: ${objectPath}`);

  const { data, error: downloadObjectError } = await oldSupabaseClient.storage
    .from(object.bucketName)
    .download(objectPath);

  if (downloadObjectError) {
    console.error(downloadObjectError);

    throw downloadObjectError;
  }

  // eslint-disable-next-line no-await-in-loop
  const { error: uploadObjectError } = await newSupabaseClient.storage
    .from(object.bucketName)
    .upload(objectPath, data, {
      upsert: true,
      contentType: object.metadata.mimetype,
      cacheControl: object.metadata.cacheControl,
    });

  if (uploadObjectError) {
    console.error(uploadObjectError);

    throw uploadObjectError;
  }
};

const getAllStorageObjects = async (supabase) => {
  const { data: buckets } = await supabase.storage.listBuckets();

  return [].concat(...await Promise.all(
    buckets.map(async (bucket) => getStorageObjects(supabase, bucket.name)),
  ));
};

const migrateStorage = async ({
  fromProjectUrl,
  fromKey,
  toProjectUrl,
  toKey,
}) => {
  const oldSupabaseClient = createClient(fromProjectUrl, fromKey);
  const newSupabaseClient = createClient(toProjectUrl, toKey);

  const [oldObjects, newObjects] = await Promise.all([
    getAllStorageObjects(oldSupabaseClient),
    getAllStorageObjects(newSupabaseClient),
  ]);

  await Promise.all(oldObjects.map(async (object) => {
    await queue.add(() => transferObject(
      oldSupabaseClient,
      newSupabaseClient,
      object,
      newObjects,
    ));
  }));
};

module.exports.run = async (opts) => {
  const { fromDbUrl, toDbUrl } = opts;

  console.log(`Dumping database: ${fromDbUrl}`);
  exec(`supabase db dump --db-url "${fromDbUrl}" -f roles.sql --role-only`);
  exec(`supabase db dump --db-url "${fromDbUrl}" -f schema.sql`);
  exec(`supabase db dump --db-url "${fromDbUrl}" -f data.sql --data-only`);

  console.log(`Recreating public schema: ${toDbUrl}`);
  exec(`psql --dbname "${toDbUrl}" -c 'DROP SCHEMA public CASCADE'`);
  exec(`psql --dbname "${toDbUrl}" -c 'CREATE SCHEMA public'`);
  exec(`psql --single-transaction --variable ON_ERROR_STOP=1 --file schema.sql --file data.sql --dbname "${toDbUrl}"`);

  await migrateStorage(opts);
};
