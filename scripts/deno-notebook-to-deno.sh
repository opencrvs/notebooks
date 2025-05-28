#!/usr/bin/env bash
set -euo pipefail

FILE=$1
OUTPUT=$2

if [ -z "$FILE" ] || [ -z "$OUTPUT" ]; then
  echo "Usage: $0 <input_file> <output_file>"
  exit 1
fi

jq -r '.cells[].source[]' "$FILE" > "$OUTPUT"