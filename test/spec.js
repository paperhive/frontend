describe('PaperHub homepage', function() {
  it('Test page title', function() {
    browser.get('/#/');

    expect(browser.getTitle()).toEqual('PaperHub');
  });
});
