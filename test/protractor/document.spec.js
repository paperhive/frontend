const utils = require('./utils');

describe('document N2iCMzBfgu3p', function() {
  it('should load and set the title', function() {
    browser.get('./documents/N2iCMzBfgu3p');
    expect(browser.getTitle()).toEqual(
      'Preconditioned Recycling Krylov subspace methods for self-adjoint problems · PaperHive'
    );
  });

  xit('should scroll to anchor J4zEJCRoRyA2', function() {
    browser.get('./documents/N2iCMzBfgu3p?a=s:J4zEJCRoRyA2');
    // anchor is on page 25 so make sure it is present and
    // in the viewport eventually
    browser.wait(() => element(by.id('p:25')).isPresent(), 10000);
    browser.wait(() => utils.isInViewport(element(by.id('p:25'))), 5000);
  });

  xit('should scroll to discussion UfRBMhjOLa42', () => {
    browser.get('./documents/N2iCMzBfgu3p?a=d:UfRBMhjOLa42');
    // discussion is on page 26 so make sure it is present and
    // in the viewport eventually
    browser.wait(() => element(by.id('p:26')).isPresent(), 10000);
    browser.wait(() => utils.isInViewport(element(by.id('p:26'))), 5000);
  })
});
