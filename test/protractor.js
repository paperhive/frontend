// Create tests list
if (process.env.TRAVIS_JOB_NUMBER) {
  // Travis tests, forwarded to SauceLabs. Test multiple browsers.
  var browsers = ['chrome', 'iexplore', 'safari'];
} else {
  // only tests chrome locally
  var browsers = ['chrome'];
}
var tests = [];
browsers.forEach(
  function(entry) {
  tests.pop({
    'browserName': entry,
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER
  });}
);

exports.config = {
  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,

  multiCapabilities: tests,

  specs: ['spec.js'],

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 60000
  },

  baseUrl: 'http://localhost:' + (process.env.HTTP_PORT || '8080')
};

console.log(process.env.TRAVIS_JOB_NUMBER);
if (process.env.TRAVIS_JOB_NUMBER === undefined) {
  // Only specify seleniumAddress locally, not for saucelabs,
  // cf. <http://stackoverflow.com/a/20889537/353337>.
  exports.config.seleniumAddress = 'http://localhost:4444/wd/hub';
}
