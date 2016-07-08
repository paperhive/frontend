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
    var aboutUs = element(by.linkText('About us'));
    expect(aboutUs.isPresent()).toBe(true);
    var linkAboutUs = element(by.id('about-us-link'));
    linkAboutUs.click();
    utils.expectUrl('./about');
  });

  it('should be present Contact link', function () {
    var contact = element(by.linkText('Contact'));
    expect(contact.isPresent()).toBe(true);
    var linkContact = element(by.id('contact-link'));
    linkContact.click();
    utils.expectUrl('./contact');
  });

  it('should be present Terms of service link', function () {
    var legalNotice = element(by.linkText('Terms of service and privacy policy'));
    expect(legalNotice.isPresent()).toBe(true);
    var linkLegalNotice = element(by.id('terms-link'));
    linkLegalNotice.click();
    utils.expectUrl('./terms');
  });

  it('should be present Legal notice link', function () {
    var legalNotice = element(by.linkText('Legal notice'));
    expect(legalNotice.isPresent()).toBe(true);
    var linkLegalNotice = element(by.id('legal-link'));
    linkLegalNotice.click();
    utils.expectUrl('./legalnotice');
  });
});
