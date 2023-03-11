# Supabase Migrate

An action for migrating one Supabase project to another.

Useful for replicating production data back in a staging environment, for example.

## Usage

Run as a scheduled process like so:

```yml
name: Run

on:
  schedule:
    - cron: '0 0 * * *' # Runs nightly

jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Migrate
        run: alexandermendes/supabase-migrate
        with:
          fromUrl: ${{ secrets.FROM_PROJECT_URL }}
          fromKey: ${{ secrets.FROM_SERVICE_ROLE_KEY }}
          toUrl: ${{ secrets.TO_PROJECT_URL }}
          toKey: ${{ secrets.TO_SERVICE_ROLE_KEY }}
```

## CLI

This package also publishes a command line script, which you can run like:

```text
npx supabase-migrate \
--from-url <PROJECT-A-PROJECT-URL> \
--from-key <SPROJECT-A-ERVICE-ROLE-KEY> \
--to-url <PROJECT-B-PROJECT-URL> \
--to-key <PROJECT-B-SERVICE-ROLE-KEY> \
```
