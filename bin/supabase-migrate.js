#!/usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const dotenv = require('dotenv');

dotenv.config();

const { argv } = yargs(hideBin(process.argv));

require('../lib/run').run({
  fromDbUrl: process.env.SUPABASE_MIGRATE_FROM_DB_URL || argv.fromDbUrl,
  fromProjectUrl: process.env.SUPABASE_MIGRATE_FROM_PROJECT_URL || argv.fromProjectUrl,
  fromKey: process.env.SUPABASE_MIGRATE_FROM_KEY || argv.fromKey,
  toDbUrl: process.env.SUPABASE_MIGRATE_TO_DB_URL || argv.toDbUrl,
  toProjectUrl: process.env.SUPABASE_MIGRATE_TO_PROJECT_URL || argv.toProjectUrl,
  toKey: process.env.SUPABASE_MIGRATE_TO_KEY || argv.toKey,
});
