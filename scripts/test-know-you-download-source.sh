#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
index_path="$repo_root/know-you/index.html"
function_path="$repo_root/functions/know-you/download.js"
update_feed_function_path="$repo_root/functions/know-you/update-feed/latest.json.js"

assert_contains() {
  local haystack="$1"
  local needle="$2"
  local label="$3"

  if [[ "$haystack" != *"$needle"* ]]; then
    echo "Assertion failed for $label" >&2
    echo "Expected to find: $needle" >&2
    exit 1
  fi
}

assert_not_contains() {
  local haystack="$1"
  local needle="$2"
  local label="$3"

  if [[ "$haystack" == *"$needle"* ]]; then
    echo "Assertion failed for $label" >&2
    echo "Did not expect to find: $needle" >&2
    exit 1
  fi
}

index_html="$(cat "$index_path")"
download_function="$(cat "$function_path")"
update_feed_function="$(cat "$update_feed_function_path")"

assert_contains "$index_html" 'href="/know-you/download"' "homepage download endpoint link"
assert_not_contains "$index_html" "github.com/gift-is-coding/know-you-downloads/releases/download" "homepage GitHub release link"

assert_contains "$download_function" "storage/v1/object/public" "download function Supabase public storage path"
assert_contains "$download_function" "update-feed/latest.json" "download function Supabase feed"
assert_contains "$download_function" "macos/v1.1.2-build305/KnowYou-1.1.2-305.dmg" "download function Supabase fallback"
assert_not_contains "$download_function" "raw.githubusercontent.com/gift-is-coding/know-you-downloads" "download function GitHub feed"
assert_not_contains "$download_function" "github.com/gift-is-coding/know-you-downloads/releases/download" "download function GitHub fallback"

assert_contains "$update_feed_function" "storage/v1/object/public" "update feed function Supabase public storage path"
assert_contains "$update_feed_function" "update-feed/latest.json" "update feed function Supabase object"
assert_not_contains "$update_feed_function" "raw.githubusercontent.com/gift-is-coding/know-you-downloads" "update feed function GitHub feed"

echo "KnowYou download source tests passed"
