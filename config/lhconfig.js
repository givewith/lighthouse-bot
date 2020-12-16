const budgetFile = require('./budget.json');

module.exports = {
  extends: 'lighthouse:default',
  settings: {
    emulatedFormFactor: 'desktop',
    throttling: {
      cpuSlowdownMultiplier: 1,
      rttMs: 40,
      throughputKbps: 10240
    },
    budgets: budgetFile
  },
};
