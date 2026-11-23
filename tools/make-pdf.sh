#!/usr/bin/env bash
# Rebuild assets/pdf/SangwooKim_CV_{en,ko}.pdf from the current site content.
# Run from the repository root: bash tools/make-pdf.sh
set -euo pipefail
cd "$(dirname "$0")/.."
SITE_DIR="$(mktemp -d)"
bundle exec jekyll build --baseurl '' -d "$SITE_DIR"
mkdir -p assets/pdf
node tools/make-pdf.js "$SITE_DIR" assets/pdf
rm -rf "$SITE_DIR"
