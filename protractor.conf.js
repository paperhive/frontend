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

// https://wiki.saucelabs.com/display/DOCS/Platform+Configurator#/
const saucelabsCapabilities = [{
  browserName: 'chrome',
  version: '61',
  platform: 'Windows 10',
  name: 'PaperHive (chrome)',
}, {
  browserName: 'firefox',
  version: '56',
  platform: 'Windows 10',
  name: 'PaperHive (firefox)'
}, {
  browserName: 'MicrosoftEdge',
  version: '15',
  platform: 'Windows 10',
  name: 'PaperHive (edge)',
}, /* {
  // Note: Safari 10 requires Selenium 3
  // (not yet running on SauceLabs as of 2017-01-09)
  browserName: 'safari',
  version: '9',
  platform: 'OS X 10.11',
  name: 'PaperHive (safari)',
},
*/
/*
// currently the PDF rendering is broken on IE11 when scrolling
// and we have no idea why
// TODO: investigate or ditch IE
{
  browserName: 'internet explorer',
  version: '11',
  platform: 'Windows 10',
  name: 'PaperHive (ie)',
}
*/
];
saucelabsCapabilities.forEach(capability => {
  capability['tunnel-identifier'] = process.env.TRAVIS_JOB_NUMBER;
  capability.tags = ['frontend'];
  if (process.env.TRAVIS_PULL_REQUEST === 'false' && process.env.TRAVIS_BRANCH === 'master') {
    capability.tags.push('master');
  }
  capability.screenResolution = '1280x960';
});

// travis or jenkins -> use saucelabs
if (process.env.TRAVIS_JOB_NUMBER || process.env.SAUCE_ONDEMAND_BROWSERS) {
  exports.config.sauceUser = process.env.SAUCE_USERNAME || process.env.SAUCE_USER_NAME;
  exports.config.sauceKey = process.env.SAUCE_ACCESS_KEY || process.env.SAUCE_API_KEY;
  exports.config.sauceBuild = process.env.TRAVIS_BUILD_NUMBER;
  exports.config.multiCapabilities = saucelabsCapabilities;
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
