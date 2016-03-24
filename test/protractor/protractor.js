'use strict';

exports.config = {
  specs: ['spec.js'],

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 60000
  },

    baseUrl: process.env.TEST_URL
//  baseUrl: 'http://localhost:' + (process.env.HTTP_PORT || '8080')
};

if (process.env.SAUCE_ONDEMAND_BROWSERS) {
  // jenkins
  // translate SAUCE_ONDEMAND_BROWSERS into a protractor-digestible list
  exports.config.multiCapabilities = [];
  JSON.parse(process.env.SAUCE_ONDEMAND_BROWSERS).forEach(function(entry) {
    exports.config.multiCapabilities.push({
      'name': 'PaperHive (' + entry.browser + ')',
      'browserName': entry.browser,
      'platform': entry.platform,
      'build': process.env.BUILD_NUMBER
    });
    // Test against deployed platform
    exports.config.baseUrl = process.env.TEST_URL;
  });

} else if (process.env.TRAVIS_JOB_NUMBER) {
  // travis
  //  {
  //  'browserName': 'android',
  //  'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
  //  'build': process.env.TRAVIS_BUILD_NUMBER
  //},
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
  exports.config.multiCapabilities = [{
    'browserName': 'chrome',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'PaperHive (chrome)'
  }, {
    'browserName': 'firefox',
    // http://stackoverflow.com/a/27645817/353337
    'version': '33',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'PaperHive (firefox)'
  }, {
    'browserName': 'safari',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'PaperHive (safari)'
  }];
} else {
  // Only test chrome locally
  exports.config.multiCapabilities = [{
    'browserName': 'chrome'
  }];
}

if (process.env.SAUCE_USER_NAME) {
  // jenkins
  exports.config.sauceUser = process.env.SAUCE_USER_NAME;
  exports.config.sauceKey = process.env.SAUCE_API_KEY;
} else if (process.env.SAUCE_USERNAME) {
  // travis
  exports.config.sauceUser = process.env.SAUCE_USERNAME;
  exports.config.sauceKey = process.env.SAUCE_ACCESS_KEY;
}
