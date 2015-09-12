'use strict';

if (process.env.SAUCE_ONDEMAND_BROWSERS) {
  // jenkins
  var capabilities = process.env.SAUCE_ONDEMAND_BROWSERS;
} else if (process.env.TRAVIS_JOB_NUMBER) {
  // travis
  var capabilities = [
  //  {
  //  'browserName': 'android',
  //  'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
  //  'build': process.env.TRAVIS_BUILD_NUMBER
  //},
  {
    'browserName': 'chrome',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'PaperHive (chrome)'
  },
  {
    'browserName': 'firefox',
    // http://stackoverflow.com/a/27645817/353337
    'version': '33',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'PaperHive (firefox)'
  },
  //{
  //  'browserName': 'iexplore',
  //  'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
  //  'build': process.env.TRAVIS_BUILD_NUMBER,
  //  'name': 'PaperHive (iexplore)'
  //},
  //{
  //  'browserName': 'ipad',
  //  'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
  //  'build': process.env.TRAVIS_BUILD_NUMBER
  //},
  //{
  //  'browserName': 'iphone',
  //  'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
  //  'build': process.env.TRAVIS_BUILD_NUMBER
  //},
  //{
  //  'browserName': 'opera',
  //  'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
  //  'build': process.env.TRAVIS_BUILD_NUMBER
  //},
  {
    'browserName': 'safari',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'PaperHive (safari)'
  },
  ];
} else {
  // Only test chrome locally
  var capabilities = [
  {
    'browserName': 'chrome'
  },
  ];
}

exports.config = {
  multiCapabilities: capabilities,

  specs: ['spec.js'],

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 60000
  },

  //baseUrl: 'http://localhost:' + (process.env.HTTP_PORT || '8080')
};

if (process.env.SAUCE_USER_NAME) {
  // jenkins
  exports.config.sauceUser = process.env.SAUCE_USER_NAME;
  exports.config.sauceKey = process.env.SAUCE_API_KEY;
} else if (process.env.SAUCE_USERNAME) {
  // travis
  exports.config.sauceUser = process.env.SAUCE_USERNAME;
  exports.config.sauceKey = process.env.SAUCE_ACCESS_KEY;
}
