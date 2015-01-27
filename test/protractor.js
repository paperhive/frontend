exports.config = {
  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,

  capabilities: {
    'browserName': 'chrome',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'ngValidation Protractor Tests'
  },

  specs: ['spec.js'],

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  },

  //seleniumAddress: 'http://localhost:4444/wd/hub'
  baseUrl: 'http://localhost:' + (process.env.HTTP_PORT || '8000')
};
