#!/bin/sh
# Re-render every section object in the magenta palette (05.10). Sequential: one GPU job at a time.
cd "$(dirname "$0")/../remotion" || exit 1
for job in "splot square" "splot tall" "skaner square" "kostka square" "przeplyw square" "siatka square" "gniazdo square" "proces wide" "proces tall"; do
  set -- $job
  echo "=== $1 $2 $(date +%T)"
  node scripts/v2-render.mjs "$1" "$2" magenta || echo "!!! FAILED $1 $2"
done
echo "=== done $(date +%T)"
