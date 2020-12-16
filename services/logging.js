const log = (message) => {
  const timestamp = new Date().toUTCString();
  console.log(`[${ timestamp }] ${ message }`);
}

module.exports = {
  log,
};
