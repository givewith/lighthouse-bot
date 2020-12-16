const https = require('https');
const loggingService = require('./logging.js');

const SLACK_URL = `${ process.env.SLACK_URL }`;

async function doSlackPost(postData) {
  const slackPost = https.request(SLACK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': postData.length
    }
  }, res => {
    loggingService.log(`Posting to Slack, status ${ res.statusCode }`);

    res.on('data', d => {
      process.stdout.write(d);
    });
  });

  slackPost.on('error', error => {
    loggingService.log(`Error posting to Slack ${ error }`);
  });

  slackPost.write(postData);
  slackPost.end();
}


module.exports = {
  doSlackPost
};
