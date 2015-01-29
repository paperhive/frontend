if (process.env.TRAVIS_JOB_NUMBER) {
  // Travis tests, forwarded to SauceLabs. Test multiple browsers.
  var browsers = ['chrome', 'iexplore', 'safari'];
  // Can't specify seleniumAddress for saucelabs, see
  // <http://stackoverflow.com/a/20889537/353337>.
  var seleniumAddress = null;
} else {
  // only tests chrome locally
  var browsers = ['chrome'];
  var seleniumAddress = 'http://localhost:4444/wd/hub';
}
var tests = [];
browsers.forEach(
  function(entry) {
  tests.pop({
    'browserName': entry,
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'PaperHub (' + entry + ')'
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

  seleniumAddress: seleniumAddress,
  baseUrl: 'http://localhost:' + (process.env.HTTP_PORT || '8080')
};
