# Fetch and Transform Workflow

This repository contains a GitHub Actions workflow that processes birth records from an OpenCRVS system using the `fetch-and-transform.ipynb` notebook.

## Using the GitHub Actions Workflow

The workflow can be run manually from the GitHub Actions tab with custom parameters:

1. Navigate to the Actions tab in your GitHub repository
2. Select the "Fetch and Transform Record" workflow
3. Click on "Run workflow"
4. Enter the following parameters:
   - **record_id**: The ID of the record to fetch and process
   - **domain**: The domain/gateway URL (without protocol, e.g., `localhost:7070`)
5. Click "Run workflow"

The workflow will:
1. Convert the Jupyter notebook to a TypeScript file
2. Inject your custom parameters into the file
3. Run the script with Deno
4. Save the results as artifacts that you can download

## Local Execution

To run the same process locally:

```bash
# Convert notebook to TypeScript
bash ./scripts/deno-notebook-to-deno.sh ./fetch-and-transform.ipynb ./tmp-script.ts

# Edit the file to replace parameters if needed
# Then run with Deno
deno run --allow-net ./tmp-script.ts
```

## Prerequisites

- Deno runtime
- jq (for notebook conversion)
