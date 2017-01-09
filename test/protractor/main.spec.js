'use strict';

var utils = require('./utils');

describe('PaperHive homepage', function() {
  it('Test page title', function() {
    browser.get('./');
    expect(browser.getTitle()).toEqual(
      'PaperHive · The coworking hub for researchers'
    );
  });

  it('should be present subscribe form', function () {
    var subscribeForm = element(by.name('subscribeForm'));
    expect(subscribeForm.isPresent()).toBe(true);
  });

  it('should be present about us link', function () {
    var linkAboutUs = element(by.id('about-us-link'));
    expect(linkAboutUs.isPresent()).toBe(true)
    linkAboutUs.click();
    utils.expectUrl('./about');
  });

  it('should be present Contact link', function () {
    var linkContact = element(by.id('contact-link'));
    expect(linkContact.isPresent()).toBe(true);
    linkContact.click();
    utils.expectUrl('./contact');
  });

  it('should be present Terms of service link', function () {
    var linkLegalNotice = element(by.id('terms-link'));
    expect(linkLegalNotice.isPresent()).toBe(true);
    linkLegalNotice.click();
    utils.expectUrl('./terms');
  });

  it('should be present Legal notice link', function () {
    var linkLegalNotice = element(by.id('legal-link'));
    expect(linkLegalNotice.isPresent()).toBe(true);
    linkLegalNotice.click();
    utils.expectUrl('./legalnotice');
  });
});
