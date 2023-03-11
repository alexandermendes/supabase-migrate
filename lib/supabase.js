const { createClient } = require('@supabase/supabase-js');

module.exports.createSupabaseClient = (supabaseUrl, supabaseKey) => createClient(
  supabaseUrl,
  supabaseKey,
);
