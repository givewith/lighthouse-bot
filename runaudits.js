const http = require('http');
const loggingService = require('./services/logging.js');
const slackService = require('./services/slack.js');

// The following is an array of keys that needs to exist in the
// profiles object in config/config.js on the server.
const PROFILES = ['profile1', 'profile2'];

const getPromise = (url) => {
	return new Promise((resolve, reject) => {
		http.get(url, (response) => {
			let chunks_of_data = [];

			response.on('data', (fragments) => {
				chunks_of_data.push(fragments);
			});

			response.on('end', () => {
				let response_body = Buffer.concat(chunks_of_data);
				resolve(response_body.toString());
			});

			response.on('error', (error) => {
				reject(error);
			});
		});
	});
}

const runnit = async _ => {
  loggingService.log('Giddyup');
  const data = [];

  for (let i = 0; i < PROFILES.length; i++) {
		const currentProfile = PROFILES[i];
    loggingService.log(`Auditing profile '${ currentProfile }'`);
    let http_promise = getPromise(`http://localhost:5000/audit?profile=${ currentProfile }`);
		let response_body = await http_promise;
    let responseJSON = JSON.parse(response_body);
    data.push(`Lighthouse score for ${ currentProfile } is ${ responseJSON.categories.performance.score * 100 }`)
  }

  loggingService.log('Fin');

  const postData = JSON.stringify({
    text: data.join('\n'),
  });

  await slackService.doSlackPost(postData);
}

runnit();
