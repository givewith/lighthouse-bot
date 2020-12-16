module.exports = {
  apps: [
    {
      script: 'server.js',
      env: {
        MONGO_DATABASE: process.env.MONGO_DATABASE,
        MONGO_URL: process.env.MONGO_URL,
        SLACK_URL: process.env.SLACK_URL,
      },
    },
  ],
};
