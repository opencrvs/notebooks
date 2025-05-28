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


jq -r '.cells[].source[]' "$FILE" > "$OUTPUT"

# Copy all potential TypeScript files to the output directory
rsync -av --include='*.ts' --exclude='*' "$FILE_DIR"/ "$OUTPUT_DIR"/
