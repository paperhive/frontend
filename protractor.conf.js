const liveServer = require('live-server');

const port = process.env.HTTP_PORT || 9998;
let server;

exports.config = {
  specs: ['test/protractor/**/*.spec.js'],

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 60000
  }
};

if (process.env.SAUCE_ONDEMAND_BROWSERS) {
  // jenkins
  // translate SAUCE_ONDEMAND_BROWSERS into a protractor-digestible list
  exports.config.multiCapabilities = [];
  JSON.parse(process.env.SAUCE_ONDEMAND_BROWSERS).forEach(function(entry) {
    exports.config.multiCapabilities.push({
      name: 'PaperHive (' + entry.browser + ')',
      browserName: entry.browser,
      version: entry['browser-version'],
      // andré: OS seems to be platform!
      platform: entry.os,
      build: process.env.BUILD_NUMBER
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
    browserName: 'chrome',
    version: '54.0',
    platform: 'Windows 10',
    name: 'PaperHive (chrome)',
  }, {
    browserName: 'firefox',
    version: '50.0',
    platform: 'Windows 10',
    name: 'PaperHive (firefox)'
  }, {
    browserName: 'MicrosoftEdge',
    version: '14.14393',
    platform: 'Windows 10',
    name: 'PaperHive (edge)',
  }, {
    browserName: 'safari',
    version: '10.0',
    platform: 'macOS 10.12',
    name: 'PaperHive (safari)',
  }];
  exports.config.multiCapabilities.forEach(capability => {
    capability['tunnel-identifier'] = process.env.TRAVIS_JOB_NUMBER;
    capability.build = process.env.TRAVIS_BUILD_NUMBER;
  });
  exports.config.baseUrl = 'http://localhost:8080';
} else {
  // Only test chrome locally
  exports.config.multiCapabilities = [{
    'browserName': 'chrome'
  }];
  exports.config.baseUrl = 'http://localhost:' + port;
  exports.config.onPrepare = function() {
    server = liveServer.start({
      root: 'build/',
      file: 'index.html',
      port: port,
      open: false,
      watch: ['non-existing']
    });
    return new Promise(function(resolve, reject) {
      server.addListener('listening', resolve);
      server.addListener('error', reject);
    });
  };
  exports.config.onComplete = function() {
    return new Promise(function(resolve, reject) {
      server.close(function (err) {
        if (err) return reject(err);
        resolve();
      });
    });
  };
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
