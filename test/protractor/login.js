'use strict';

describe('login page', function() {
    var form, username;
    
    beforeEach(function() {
	browser.get('/#/login');
	form = element(by.name('loginForm'));
    });
    
    it('should be present sign in with Google account', function () {
	var googleLogin = element(by.xpath('/html/body/main/div/div/div[2]/a[1]'));
	expect(googleLogin.isPresent()).toBe(true);

    });

    it('should be present sign in with ORCID', function () {
	var orcidLogin = element(by.xpath('/html/body/main/div/div/div[2]/a[2]'));
	expect(orcidLogin.isPresent()).toBe(true);
    });


    it('should log in if credentials are right', function() {
	var emailOrUsername = form.element(by.name('emailOrUsername'));
	var password = form.element(by.name('password'));
	var loginButton = form.element(by.xpath('/html/body/main/div/div/div[4]/form/div[4]/button'));
	
	emailOrUsername.clear();
	password.clear();
	emailOrUsername.sendKeys('test');
	password.sendKeys('testpwd');
	loginButton.click();

	// expect(browser.getCurrentUrl()).toBe('SHOULD BE LOGGED IN URL');
	expect($('[ng-class=dropdown-toggle]').isDisplayed()).toBeTruthy();

    });

    it('should stay in log in page if credentials does not match', function() {
	var emailOrUsername = form.element(by.name('emailOrUsername'));
	var password = form.element(by.name('password'));
	var loginButton = form.element(by.xpath('/html/body/main/div/div/div[4]/form/div[4]/button'));
	emailOrUsername.sendKeys('user');
	loginButton.click();

	expect(browser.getCurrentUrl()).toBe('http://localhost:8080/login');

    });


        
});
