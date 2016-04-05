'use strict';

describe('logedIn main page', function() {
    var form, username;
    
    beforeEach(function() {
	this.url = browser.baseUrl;
	browser.get(this.url + 'login');
	form = element(by.name('loginForm'));

	var emailOrUsername = form.element(by.name('emailOrUsername'));
	var password = form.element(by.name('password'));
	var emailLoginButton = element(by.id('email-login-button'));
     	                                         
	emailOrUsername.clear();
	password.clear();
	emailOrUsername.sendKeys('adalovelace');
	password.sendKeys('c0d1ng4lifeYO');
	emailLoginButton.click();

    });
    
    it('should log in', function() {
	expect(browser.getCurrentUrl()).toBe(this.url);
    });

    it('should have a user menu', function() {
	var userMenu = element(by.id('user-menu-items'));
	expect(userMenu.isPresent()).toBe(true);
    });

    it('should have 4 items in user menu list', function() {

//	$('#user-menu-items').findElement(by.linkName('Profile')
	element.all(by.css('#user-menu-items li')).then(function(items) {
//	element.all(by.id('user-menu-items li')).then(function(items) {
	    expect(items.length).toBe(4);
	    console.log('Items in #user-menu-items', items);
//	    expect(items[0].getText()).toBe('Profile');
//	    expect(items[1].getText()).toBe('Add arXiv article');
//	    expect(items[2].getText()).toBe('Settings');
//	    expect(items[0].getText()).toBe('Log out');
	});
    });
    
    xit('should go to profile page', function() {
	element.all(by.id('user-menu-items li')).then(function(items) {
	    var userProfile = items[0];
	    userProfile.click();
	    expect(browser.getCurrentUrl).toBe(this.url + 'users/adalovelace');
	});
    });

    xit('should go to Add document page', function() {
	element.all(by.id('user-menu-items li')).then(function(items) {
	    var userAddArXiv = items[1];
	    userAddArXiv.click();
	    expect(browser.getCurrentUrl).toBe(this.url + 'documents/new');
	});
    });

    xit('should go to Settings page', function() {
	element.all(by.id('user-menu-items li')).then(function(items) {
	    var userSettings = items[2];
	    userSettings.click();
	    expect(browser.getCurrentUrl).toBe(this.url + 'settings');
	});
    });

    xit('should Log out', function() {
	element.all(by.id('user-menu-items li')).then(function(items) {
	    var userLogOut = items[3];
	    userLogOut.click();
   	});
	
	expect(browser.getCurrentUrl).toBe(this.url);
	expect(element(by.id('user-menu-items').isPresent(false)));

    });

       
});
