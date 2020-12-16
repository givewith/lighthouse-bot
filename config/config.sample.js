/*
 * Rename this to config.js but don't check this file in!
 * The keys in the `profiles` object should map to the values in
 * the `profiles` array in runaudits.js.
*/
module.exports = {
  profiles: {
    profile1: {
      page_url: 'https://login.myapp.com'
    },
    profile2: {
      page_url: 'https://app.myapp.com',
      login_url: 'https://login.myapp.com',
      username: 'user@email.com',
      password: 'MYs3cR3t!',
    }
  }
}
