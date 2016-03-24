'use strict';

describe('PaperHive homepage', function() {


 beforeEach(function () {
     this.url = browser.baseUrl;
  });
 
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
	var linkAboutUs = element(by.xpath('/html/body/footer/ng-include/div[1]/div/div/div[2]/ul/li[1]/a'));
	linkAboutUs.click();

	expect(browser.getCurrentUrl()).toBe(this.url+'/about');

    });

    it('should be present Contact link', function () {
	var contact = element(by.linkText('Contact'));
	expect(contact.isPresent()).toBe(true);

	var linkContact = element(by.xpath('/html/body/footer/ng-include/div[1]/div/div/div[2]/ul/li[2]/a'));
	linkContact.click();
	expect(browser.getCurrentUrl()).toBe(this.url+'/contact');
    });

    it('should be present Terms of service link', function () {
	var legalNotice = element(by.linkText('Terms of Service and Privacy Policy'));
	expect(legalNotice.isPresent()).toBe(true);
	var linkLegalNotice = element(by.xpath('/html/body/footer/ng-include/div[1]/div/div/div[2]/ul/li[3]/a'));
	linkLegalNotice.click();
	expect(browser.getCurrentUrl()).toBe(this.url+'/terms');
    });


    it('should be present Legal notice link', function () {
	var legalNotice = element(by.linkText('Legal notice'));
	expect(legalNotice.isPresent()).toBe(true);
	var linkLegalNotice = element(by.xpath('/html/body/footer/ng-include/div[1]/div/div/div[2]/ul/li[4]/a'));
	linkLegalNotice.click();
	expect(browser.getCurrentUrl()).toBe(this.url+'/legalnotice');
    });

});
