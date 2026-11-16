#!/usr/bin/env bash
# One-time preparation helper. Run from a checkout of the Beta preparation branch.
# This does NOT deploy, push, or modify Stable.
set -euo pipefail
ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"
test "$(git branch --show-current)" = "release/independent-build-prep" || {
  echo "Refusing to import outside release/independent-build-prep" >&2
  exit 1
}
test ! -e baseline || { echo "baseline/ already exists; refusing overwrite" >&2; exit 1; }
SOURCE="${1:-}"
test -n "$SOURCE" && test -f "$SOURCE/index.html" && test -f "$SOURCE/manifest.webmanifest" || {
  echo "Usage: $0 /path/to/verified-stable-source-checkout" >&2
  exit 1
}
mkdir baseline
cp -a "$SOURCE"/. baseline/
rm -rf baseline/.git baseline/.github
test -s baseline/index.html
test -s baseline/manifest.webmanifest
(test -s baseline/sw.js || test -s baseline/service-worker.js)
echo "Imported local baseline into baseline/. Review diff before committing."
echo "No push or deployment performed."
