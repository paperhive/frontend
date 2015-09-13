'use strict';

exports.config = {
  specs: ['spec.js'],

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 60000
  },

  //baseUrl: 'http://localhost:' + (process.env.HTTP_PORT || '8080')
};

if (process.env.SAUCE_ONDEMAND_BROWSERS) {
  // jenkins

  //// translate SAUCE_ONDEMAND_BROWSERS into a protractor-digestible list
  //var list = process.env.SAUCE_ONDEMAND_BROWSERS;
  //exports.config.multiCapabilities = [];
  //for (var i = 0; i < list.length; i++) {
  //  exports.config.multiCapabilities.push({
  //    'browserName': list[i].browser,
  //    //'os': list[i].os
  //  });
  //}
  // Only test chrome locally
  exports.config.multiCapabilities = [
  {
    'browserName': 'chrome'
  },
  {
    'browserName': 'firefox'
  }
  ];

} else if (process.env.TRAVIS_JOB_NUMBER) {
  // travis
  exports.config.multiCapabilities = [
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
  exports.config.multiCapabilities = [
  {
    'browserName': 'chrome'
  },
  ];
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
