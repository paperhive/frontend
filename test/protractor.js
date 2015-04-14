if (process.env.TRAVIS_JOB_NUMBER) {
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
    'version': "34",
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
  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,

  multiCapabilities: capabilities,

  specs: ['spec.js'],

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 60000
  },

  baseUrl: 'http://localhost:' + (process.env.HTTP_PORT || '8080')
};

if (process.env.TRAVIS_JOB_NUMBER === undefined) {
  // Don't specify seleniumAddress for travis/saucelabs builds, cf.
  // <http://stackoverflow.com/a/20889537/353337>.
  exports.config.seleniumAddress = 'http://localhost:4444/wd/hub';
}
