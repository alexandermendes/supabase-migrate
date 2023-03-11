# Supabase Migrate

A script for migrating one Supabase project to another.

## Usage

This package publishes a command line script, which you can run like so:

```text
npx supabase-migrate \
--from-db-url <PROJECT-A-DATABASE-URL> \
--from-project-url <PROJECT-A-PROJECT-URL> \
--from-key <PROJECT-A-SERVICE-ROLE-KEY> \
--to-db-url <PROJECT-B-DATABASE-URL> \
--to-project-url <PROJECT-B-PROJECT-URL> \
--to-key <PROJECT-B-SERVICE-ROLE-KEY>
```

Or you can install the package:

```text
yarn add supabase-migrate
```

And run with:

```text
yarn supabase-migrate
```

The values CLI arguments can be passed in as above, read from a `.env` file (see below),
or otherwise set as environment variables before the script is run.

```sh
SUPABASE_MIGRATE_FROM_DB_URL=<PROJECT-A-DATABASE-URL>
SUPABASE_MIGRATE_FROM_PROJECT_URL=<PROJECT-A-PROJECT-URL>
SUPABASE_MIGRATE_FROM_KEY=<PROJECT-A-SERVICE-ROLE-KEY>
SUPABASE_MIGRATE_TO_DB_URL=<PROJECT-B-DATABASE-URL>
SUPABASE_MIGRATE_TO_PROJECT_URL=<PROJECT-B-PROJECT-URL>
SUPABASE_MIGRATE_TO_KEY=<PROJECT-B-SERVICE-ROLE-KEY>
```
