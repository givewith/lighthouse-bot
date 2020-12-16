/**
 * This file is borrowed heavily from
 * https://github.com/GoogleChrome/lighthouse/blob/master/docs/recipes/auth/example-lh-auth.js
 */

/**
 * @license Copyright 2019 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const fs = require('fs');
const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const config = require('./config/config.js');
const lhConfig = require('./config/lhconfig.js');

// This port will be used by Lighthouse later. The specific port is arbitrary.
const PORT = 8041;

async function login(profileConfig, browser) {
  const page = await browser.newPage();
  await page.goto(profileConfig.login_url);
  await page.waitForSelector('input[type="text"]', {visible: true});

  const cookiesPopupButton = await page.$('.CookiesPopup__buttons .Button:last-child')
  await cookiesPopupButton.click();

  // Fill in and submit login form.
  const emailInput = await page.$('input[type="text"]');
  await emailInput.type(profileConfig.username);
  const passwordInput = await page.$('input[type="password"]');
  await passwordInput.type(profileConfig.password);
  const checkboxInput = await page.$('button.Checkbox')
  await checkboxInput.click();

  const submitButton = await page.$('button[type=submit]');

  await Promise.all([
    page.waitForNavigation(),
    submitButton.click()
  ]);

  await page.close();
}

async function main({ profile }) {
  console.log(`Fetching profile ${ profile }`);
  const profileConfig = config.profiles[profile];
  // Direct Puppeteer to open Chrome with a specific debugging port.
  const browser = await puppeteer.launch({
    args: [`--remote-debugging-port=${PORT}`],
    headless: true,
    // slowMo: 50,
  });

  if (profileConfig.login_url) {
    // Setup the browser session to be logged into the site.
    await login(profileConfig, browser);
  }

  // Direct Lighthouse to use the same port.
  const result = await lighthouse(profileConfig.page_url, {output: 'html', logLevel: 'info', port: PORT}, lhConfig);

  // Direct Puppeteer to close the browser as we're done with it.
  await browser.close();

  console.log('Report is done for', result.lhr.finalUrl);
  console.log('Performance score was', result.lhr.categories.performance.score * 100);

  return result;
}

if (require.main === module) {
  main();
} else {
  module.exports = {
    main,
    login,
  };
}
