'use strict';

describe('PaperHive homepage', function() {
  it('Test page title', function() {
    browser.get('./');

    expect(browser.getTitle()).toEqual('PaperHive · Papers, alive.');
  });
});
