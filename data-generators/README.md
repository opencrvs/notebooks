## How to use the data generators

#### Set up your .env

Copy `.env.example` and rename it to `.env`

Set your domain, registrar and admin details

#### Create types for the events for your country

Run `prepareEvents.ipynb`

This should generate types based on your events


#### Generate some data

Run `generateData.ipynb`

This will generate random events from based on your country's event config.

- Set NUMBER_TO_GENERATE for total records
- Set START_FROM to the number already generated (to avoid trackingId collisions)
- Set the BATCH_SIZE for the number of records to batch together in the bulk import endpoint
