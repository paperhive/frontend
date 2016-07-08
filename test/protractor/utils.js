var url = require('url');

exports.expectUrl = function(_url) {
  expect(browser.getCurrentUrl()).toBe(url.resolve(browser.baseUrl, _url));
};