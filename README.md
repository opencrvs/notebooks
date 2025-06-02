# OpenCRVS Research notebooks

This repository contains Jupyter notebooks & Github actions pipelines to be used in researching OpenCRVS data and configurations.

### Github Actions
- **Migrate one record from v1 to v2**
  - This pipeline runs the [fetch-and-transform.ipynb](./v1-to-v2-data-migration/fetch-and-transform.ipynb) notebook with given input, effectively migrating one OpenCRVS legacy record to an Events v2 record.
  - Useful especially for QA testing and side-by-side comparisons

### To get started with local development

1. Install Deno and Deno Jupyter kernel
2. Install [Jupyter extension for VSCode](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.jupyter)
3. Open up a notebook, select Deno as kernel and run

