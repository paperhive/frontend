const utils = require('./utils');

describe('document N2iCMzBfgu3p', function() {
  it('should load and set the title', function() {
    browser.get('./documents/N2iCMzBfgu3p');
    expect(browser.getTitle()).toEqual(
      'Preconditioned Recycling Krylov subspace methods for self-adjoint problems · PaperHive'
    );
  });

  it('should scroll to anchor J4zEJCRoRyA2', function() {
    browser.get('./documents/N2iCMzBfgu3p?a=s:J4zEJCRoRyA2');
    browser.wait(() => element(by.id('p:25')).isPresent(), 10000);
    browser.wait(() => utils.isInViewport(element(by.id('p:25'))), 5000);
  });
});
