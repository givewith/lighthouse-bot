# Givewith Lighthouse Bot

This repo contains scripts that will Givewith uses to programmatically run a Lighthouse audits. It supports testing authenticated pages,
which can be configured by specifying a `login_url`, `username`, and `password` in the config object. If specified, the script will
first login to the specified URL with the username and password, then run the Lighthouse audit on the page URL. if `login_url` is omitted,
the Lighthouse audit will run on `page_url` without any login process. Configuration is specified via "profiles", set in the config object. See below.

## Configuration
Create a file called `config.js` (use `config/config.sample.js` as a starting point) in the config directory that looks like this:

```json
module.exports = {
  "profiles": {
    "app1": {
      "page_url": "https://login.yourapp.com",
    },
    "app2": {
      "page_url": "https://subdomain.yourapp.com/dashboard",
      "login_url": "https://login.yourapp.com",
      "username": "user@domain.com",
      "password": "S3cr3T!",
    }
  }
}
```
## How it works
This is intended to be run via PM2, which will expose an endpoint at port 5000. It's pretty straightforward, but
take a look at `ecosystem.config.js`. While it might not be recommended to use such a rudimentary server in a production
environment, this service is not critical to business functions, and has so far proved sufficient.

##  Environment Variables
The repo relies on a few environment variables being present. You can see them in `ecosystem.config.js`. Specifically,
it looks for the presence of:
- `MONGO_DATABASE` - the Mongo database in which to store the lighthouse JSON results
- `MONGO_URL` - the Mongo URL connection string
- `SLACK_URL` - the Slack URL to hit with the results

## Running it locally
- If using NVM, run `nvm use` (see `.nvmrc` for recommended Node version)
- Run `npm install`
- Make sure your environment variables are set, as indicated above
- Run `node server.js`, which will run a server at port 5000
- Call it via the endpoint specified below, or run the script `runaudits.js` to execute a batch of audits

## Testing Auth'd Pages
The current implementation is specific to Givewith's login -> redirect mechanism. If your setup is different, you
may need to modify the `login` function in audit.js.

## Calling it
You can run a single audit by calling `http://your-url.com:5000/audit?profile={ PROFILE_KEY_IN_CONFIG }`

## Running several audits
Take a look at `runaudits.js` and notice the `profiles` array - these are keys that are iterated
through and then sequentially passed into the audit URL. We currently have this script running as a cron job.

## Other cool features
It'll post to Slack! At the end of `runaudits.js`, it keeps track of each profile and associated score
and posts it to a Slack channel.

## What's not in here
Deployment! At Givewith, we're an AWS shop, so our deployment scripts pick up changes to the `main` branch and deploy
via CodeDeploy, but you should be able to utilize your existing deployment process to deploy these files to a server/instance
and initiate a server. Our deploy script looks roughly like this:
```
npm install -g pm2 -f

echo 'pm2 installed globally'

npm install

echo 'dependencies installed'

echo 'starting server'

pm2 reload ecosystem.config.js

```
