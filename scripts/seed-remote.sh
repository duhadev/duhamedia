#!/usr/bin/env bash
# Seed a Vercel environment's Neon DB + Blob store from this laptop.
# Vercel "Sensitive" env vars can't be pulled, so the secrets are typed in here
# (hidden input, never written to disk). Dry run first, then a real run on "yes".
#
#   scripts/seed-remote.sh preview
#   scripts/seed-remote.sh production
set -euo pipefail
cd "$(dirname "$0")/.."

case "${1:-}" in
  preview)    app_env=staging;    site_url=https://staging.duhamedia.com ;;
  production) app_env=production; site_url=https://duhamedia.com ;;
  *) echo "usage: $0 preview|production" >&2; exit 2 ;;
esac

echo "Seeding the $1 environment. Paste each value (input is hidden)."
read -rsp "Neon DIRECT connection string (DATABASE_URL_UNPOOLED, from Neon → Connect, pooling OFF): " db; echo
read -rsp "BLOB_READ_WRITE_TOKEN for the $1 Blob store (vercel_blob_rw_...): " blob; echo
read -rsp "PAYLOAD_SECRET for $1 (same value as in Vercel): " secret; echo
[[ -n "$db" && -n "$blob" && -n "$secret" ]] || { echo "All three values are required." >&2; exit 1; }

export DATABASE_URL="$db" DATABASE_URL_UNPOOLED="$db" BLOB_READ_WRITE_TOKEN="$blob" \
  PAYLOAD_SECRET="$secret" APP_ENV="$app_env" SITE_URL="$site_url"
unset db blob secret

echo; echo "== Dry run (rolls back) =="
SEED_DRY_RUN=1 npx -y pnpm@11.28.3 seed

read -rp "Dry run done. Type 'yes' to seed $1 for real: " ok
[[ "$ok" == yes ]] || { echo "Stopped. Nothing was written."; exit 0; }
npx -y pnpm@11.28.3 seed
echo "Seeded $1."
