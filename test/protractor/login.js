'use strict';

describe('login page', function() {
    var form, username;

    beforeEach(function () {
	this.url = browser.baseUrl;
	browser.get(this.url + '/login');
	form = element(by.name('loginForm'));
    });

    
    it('should be present sign in with Google account', function () {
//	var googleLogin = element(by.xpath('/html/body/main/div/div/div[2]/a[1]'));
	var googleLogin = element(by.id('google-login-button'));
	expect(googleLogin.isPresent()).toBe(true);

    });

    it('should be present sign in with ORCID', function () {
//	var orcidLogin = element(by.xpath('/html/body/main/div/div/div[2]/a[2]'));
	var orcidLogin = element(by.id('orcid-login-button'));
	expect(orcidLogin.isPresent()).toBe(true);
    });


    it('should log in if credentials are right', function() {
	browser.get('https://dev.paperhive.org/frontend/master/login');

	var emailOrUsername = form.element(by.name('emailOrUsername'));
	var password = form.element(by.name('password'));
//	var loginButton = form.element(by.xpath('/html/body/main/login/div/div/div[4]/form/div[4]/button'));
  	var emailLoginButton = element(by.id('email-login-button'));   	                                         
	emailOrUsername.clear();
	password.clear();
	emailOrUsername.sendKeys('adalovelace');
	password.sendKeys('c0d1ng4lifeYO');
	emailLoginButton.click();

	expect(browser.getCurrentUrl()).toBe('https://dev.paperhive.org/frontend/master/');

    });

    it('should stay in log in page if credentials does not match', function() {
	var emailOrUsername = form.element(by.name('emailOrUsername'));
	var password = form.element(by.name('password'));
//	var loginButton = form.element(by.xpath('/html/body/main/div/div/div[4]/form/div[4]/button'));
	var emailLoginButton = element(by.id('email-login-button'));   	                                         
	emailOrUsername.sendKeys('user');
	emailLoginButton.click();

	expect(browser.getCurrentUrl()).toBe('http://localhost:8080/login');

    });


        
});
