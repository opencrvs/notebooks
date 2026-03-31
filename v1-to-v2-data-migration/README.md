# OpenCRVS Events v1.0 to v2.0 data migration

## Steps to run

- Start your environment locally for the country you want to migrate
- Create your `.env` file from the `.env.example`
- For production, a system admin will need to create an Import/Export client and save the client ID and secret and save them as github secrets
- Set up your Address and StreetLevelDetails types in `./countryData/addressResolver.ts` to match your country config
- Run `./get-field-diff.ipynb`
- The output will tell you which fields you have not mapped or resolved:  
- Once you get "Ok to proceed with migration" 
  - Run `./migrate.ipynb`
- If the migration is successful, it will print out a list of successful migrations

**NOTE: to re-run a notebook after making changes, you need to Click Restart and Run All**


## How to set up migrations for countries

Most country migrations will start with a branch in the notebooks repo, but in order to do production migrations, we need sensitive data so that needs to be kept within the country organisation.
There are 2 github actions: `migrate.yml` and `migrate-prod.yml` 
`migrate-prod` uses github secrets while `migrate` takes user input.
In the case where your production does not use a VPN, just ignore those steps

- Fork the notebooks repository into the country organisation.
	- If you've already created a branch for the country, be sure to fork all branches, not just main
	- Merge country branch into main
- Add VPN details to github actions 
	- Get VPN github action details from existing country config actions e.g. `/opencrvs-{countryName}/github/workflows/deploy-prod.yml`
	- Modify `/github/workflows/migrate-prod.yml`  and replace `# ADD VPN SETUP STEPS HERE` with the above VPN steps 
	- Take note of all secrets required by the VPN steps, e.g. `secrets.VPN_USER`
- Create environments
	- In github settings, create 2 environments `staging` and `production`
	- Add all secrets for the VPN details, these should be the same as the secrets in the country config, to each environment
	- Add `OPENCRVS_CLIENT_ID` and `OPENCRVS_CLIENT_SECRET` to both environment secrets, we'd add the value next
- Create migration client for each environment
	- Login as an admin user
	- Go to `Configuration -> Integrations -> Create client`
	- Create client with name 'Migrations' and type 'Import/Export'
	- Copy the Client ID and Client secret and save them in the github secrets for each environment

## Example process
- Approach:
	- Configure 1.9 completely for the birth & death events you are trying to migrate
	- Fork the OpenCRVS Notebook and install your Node runtime e.g. Deno to run these Jupyter notebooks in VSCode
	- Update your address / name mappings and resolvers to those that suit your country here: https://github.com/opencrvs/notebooks/blob/main/v1-to-v2-data-migration/countryData/addressResolver.ts. The administrativeArea prop should be set to the field id for the leaf level select for admin levels that you have configured in your 1.9 `application-config.ts`
	- Update your country mappings and resolvers that are appropriate to your form - usually for custom fields


	- Madagascar example:
		https://github.com/opencrvs/notebooks/blob/mdg-migrations/v1-to-v2-data-migration/countryData/addressMappings.ts
		https://github.com/opencrvs/notebooks/blob/mdg-migrations/v1-to-v2-data-migration/countryData/addressResolver.ts
		https://github.com/opencrvs/notebooks/blob/mdg-migrations/v1-to-v2-data-migration/countryData/countryMappings.ts
		https://github.com/opencrvs/notebooks/blob/mdg-migrations/v1-to-v2-data-migration/countryData/countryResolvers.ts
		https://github.com/opencrvs/notebooks/blob/mdg-migrations/v1-to-v2-data-migration/countryData/nameMappings.ts
		https://github.com/opencrvs/notebooks/blob/mdg-migrations/v1-to-v2-data-migration/countryData/nameResolver.ts


	- Locally run the tasks in the https://github.com/opencrvs/notebooks/blob/main/v1-to-v2-data-migration/get-field-diff.ipynb notebook to make sure that your 1.9 forms have been configured so that every field in 1.8 has a new field in 1.9 to migrate data too.  This will obviously fail first time as you need to make your country specific mappers and resolvers


	Once that script passes, ...


	In an incognito window, load the 1.8 version of your app and create some test records to migrate:


	http://localhost:3000/?V2_EVENTS=false


	- Run the migrate notebook with test system client API details and a test Registrar locally to see if the records migrated OK:  https://github.com/opencrvs/notebooks/blob/mdg-migrations/v1-to-v2-data-migration/migrate.ipynb
	- Deploy 1.9 to the target (QA) environment
	- Obtain QA server env var/secrets for the notebook and set them in Github Secrets
	- Create test records to migrate on your QA environment (There probably already are a lot of records there)
	- Run the https://github.com/opencrvs/notebooks/blob/mdg-migrations/.github/workflows/migrate.yml Github Action to migrate the environment.  This action will need edited with VPN access commands as you have already for other actions in your forked countryconfig repo
	- Quality assure your 1.9 config thoroughly
	- Repeat in staging and production