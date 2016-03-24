'use strict';

describe('login page', function() {
    var form, username;

    beforeEach(function () {
	this.url = browser.baseUrl;
	browser.get(this.url + '/login');
	form = element(by.name('loginForm'));
    });

    it('should be present sign in with Google account', function () {
	var googleLogin = element(by.id('google-login-button'));
	expect(googleLogin.isPresent()).toBe(true);

    });

    it('should be present sign in with ORCID', function () {
	var orcidLogin = element(by.id('orcid-login-button'));
	expect(orcidLogin.isPresent()).toBe(true);
    });


    it('should log in if credentials are right', function() {
	var emailOrUsername = form.element(by.name('emailOrUsername'));
	var password = form.element(by.name('password'));
  	var emailLoginButton = element(by.id('email-login-button'));   	                                         
	emailOrUsername.clear();
	password.clear();
	emailOrUsername.sendKeys('adalovelace');
	password.sendKeys('c0d1ng4lifeYO');
	emailLoginButton.click();

	expect(browser.getCurrentUrl()).toBe(this.url);
    });

    it('should stay in log in page if credentials does not match', function() {
	var emailOrUsername = form.element(by.name('emailOrUsername'));
	var password = form.element(by.name('password'));
	var emailLoginButton = element(by.id('email-login-button'));   	                                         
	emailOrUsername.sendKeys('user');
	emailLoginButton.click();

	expect(browser.getCurrentUrl()).toBe(this.url + 'login');
    });
});
