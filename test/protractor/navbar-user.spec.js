'use strict';

var utils = require('./utils');

describe('logedIn main page', function() {
  var form;

  beforeEach(function() {
    browser.get('./login');
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
    utils.expectUrl('./');
  });

  it('should have a user menu', function() {
    var userMenu = element(by.id('user-menu-items'));
    expect(userMenu.isPresent()).toBe(true);
  });

  xit('should have 4 items in user menu list', function() {

    //	$('#user-menu-items').findElement(by.linkName('Profile')

    var listElements = element.all(by.css('#user-menu-items li'));

    listElements.then(function(items) {

      expect(items.length).toBe(4);
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
      utils.expectUrl('./users/adalovelace');
    });
  });

  xit('should go to Add document page', function() {
    element.all(by.id('user-menu-items li')).then(function(items) {
      var userAddArXiv = items[1];
      userAddArXiv.click();
      utils.expectUrl('./documents/new');
    });
  });

  xit('should go to Settings page', function() {
    element.all(by.id('user-menu-items li')).then(function(items) {
      var userSettings = items[2];
      userSettings.click();
      utils.expectUrl('./settings');
    });
  });

  xit('should Log out', function() {
    element.all(by.id('user-menu-items li')).then(function(items) {
      var userLogOut = items[3];
      userLogOut.click();
    });

    expect(browser.getCurrentUrl).toBe(browser.baseUrl);
    expect(element(by.id('user-menu-items').isPresent(false)));

  });
});
