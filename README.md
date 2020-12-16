# Givewith Performance Metrics

This repo contains a script that will programmatically run a Lighthouse audit. It supports testing authenticated pages,
which can be configured by specifying a `login_url`, `username`, and `password` in the config object. The script will
first login to the specified URL with the username and password, then run the Lighthouse audit on the page URL. Configuration
is done via "profiles", set in the config object. See below.

## Configuration
Create a file called `config.js` in the root of this directory that looks like this:

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
This is intended to be run via PM2, which will expose an endpoint at port 5000. It's pretty straighfroward, but
take a look at ecosystem.config.js. While it might not be recommended to use such a rudimentary server in a production
environment, this service is not critical to business functions, and has so far proved sufficient.

##  Environment Variables
The repo relies on a few environment variables being present. You can see them in `ecosystem.config.js`. Specifically,
it looks for the presence of:
- `MONGO_DATABASE` - the Mongo database in which to store the lighthouse JSON results
- `MONGO_URL` - the Mongo URL connection string
- `SLACK_URL` - the Slack URL to hit with the results

## Running it locally
- If using NVM, run `nvm use`
- Then `npm install`
- Make sure your environment variables are set
- Run `node server.js`, which will run a server at port 5000

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
