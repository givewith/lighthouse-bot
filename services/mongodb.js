const { MongoClient } = require('mongodb');

let _client;

async function init() {
  const mongoClient = new MongoClient(`${process.env.MONGO_URL}`, { useUnifiedTopology: true });

  try {
    await mongoClient
      .connect()
      .then(() => {
        console.log('Connected to database.');
        _client = mongoClient;
      })
      .catch(error => {
        console.log('Error connecting to database.');
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
}

const getCollection = (collectionName) => {
  return _client.db(`${ process.env.MONGO_DATABASE }`).collection(`${ collectionName }`);
}

const getClient = () => {
  return _client;
}

module.exports = {
  init,
  getClient,
  getCollection,
}
