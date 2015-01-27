exports.config = {
  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,

  multiCapabilities: [
    {
    'browserName': 'android',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'PaperHub (Android)'
  },
  {
    'browserName': 'chrome',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'PaperHub (Chrome)'
  },
  {
    'browserName': 'firefox',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'PaperHub (Firefox)'
  },
  {
    'browserName': 'iexplore',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'PaperHub (Internet Explorer)'
  },
  {
    'browserName': 'ipad',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'PaperHub (iPad)'
  },
  {
    'browserName': 'iphone',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'PaperHub (iPhone)'
  },
  {
    'browserName': 'opera',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'PaperHub (Opera)'
  },
  {
    'browserName': 'safari',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'PaperHub (Safari)'
  },
  ],

  specs: ['spec.js'],

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  },

  // Can't specify seleniumAddress, see
  // <http://stackoverflow.com/a/20889537/353337>.
  //seleniumAddress: 'http://localhost:4444/wd/hub',
  baseUrl: 'http://localhost:' + (process.env.HTTP_PORT || '8080')
};
