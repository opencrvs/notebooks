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