describe('PaperHub homepage', function() {
  it('Test page title', function() {
    browser.get('http://localhost:8080/#/articles/0af5e13/');

    expect(browser.getTitle()).toEqual('PaperHub');
  });
});
