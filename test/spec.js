describe('PaperHub homepage', function() {
  it('Test page title', function() {
    browser.get('/#/articles/0af5e13/settings');

    expect(browser.getTitle()).toEqual('PaperHub');
  });
});
