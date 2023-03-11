const { createSupabaseClient } = require('./supabase');

module.exports.run = ({
  fromUrl,
  fromKey,
  toUrl,
  toKey,
}) => {
  const supabaseFrom = createSupabaseClient(fromUrl, fromKey);
  const supabaseTo = createSupabaseClient(toUrl, toKey);
};
