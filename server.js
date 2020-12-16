const http = require('http');
const url = require('url');
const audit = require('./audit.js');
const mongo = require('./services/mongodb.js');

async function init() {
  await mongo.init();

  const mongoCollection = mongo.getCollection('performance_audits');

  const server = http.createServer();

  server.on('request', async (req, res) => {
    const requestUrl = url.parse(req.url, true);
    const { pathname } = requestUrl;

    if (pathname === '/') {
      res.write('ok');
    }

    if (pathname === '/audit') {
      const { query: { profile } } = requestUrl;
      if (!profile) {
        res.write('Please specify a profile.');
      } else {
        const result = await audit.main({ profile });
        await mongoCollection
          .insertOne({ "timestamp": new Date() })
          .then(res => {
            mongoCollection.updateOne({"_id": res.insertedId}, { $set: { data: result.lhr } }, {"upsert": true})
          });
        res.write(JSON.stringify(result.lhr));
      }
    }

    res.end();
  });

  return server;
}

init().then(server => {
  server.listen(5000);
  console.log(`The HTTP Server is running on port 5000`);
});
