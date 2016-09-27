const co = require('co');
const url = require('url');

exports.expectUrl = function(_url) {
  expect(browser.getCurrentUrl()).toBe(url.resolve(browser.baseUrl, _url));
};

exports.isInViewport = co.wrap(function* (el) {
  const location = yield el.getLocation();
  const size = yield el.getSize();
  const windowInfo = yield browser.executeScript('return {x: window.pageXOffset, y: window.pageYOffset, width: window.innerWidth, height: window.innerHeight};');
  return location.y + size.height > windowInfo.y &&
    location.y < windowInfo.y + windowInfo.height &&
    location.x + size.width > windowInfo.x &&
    location.x < windowInfo.x + windowInfo.width;
});
