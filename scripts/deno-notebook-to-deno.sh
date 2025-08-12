#!/usr/bin/env bash
set -euo pipefail

FILE=$1
OUTPUT=$2

if [ -z "$FILE" ] || [ -z "$OUTPUT" ]; then
  echo "Usage: $0 <input_file> <output_file>"
  exit 1
fi

FILE_DIR="$(cd "$(dirname "$FILE")" && pwd)"
OUTPUT_DIR="$(cd "$(dirname "$OUTPUT")" && pwd)"


# Extract only code cells, filtering out markdown cells
jq -r '.cells[] | select(.cell_type == "code") | .source[]' "$FILE" > "$OUTPUT" 2>/dev/null || {
  # Fallback: if the file doesn't have proper cell_type fields,
  # try to filter out markdown content using pattern matching
  jq -r '.cells[].source[]' "$FILE" | grep -v '^\s*##\?\s' | grep -v '^\s*###\s' | grep -v '^\s*####\s' | grep -v '^\s*$' > "$OUTPUT"
}

# Copy all potential TypeScript files to the output directory
rsync -av --include='*.ts' --include='*/'  --exclude='*' "$FILE_DIR"/ "$OUTPUT_DIR"/
