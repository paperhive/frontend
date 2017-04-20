export default function(app) {
  app.component('urlShare', {
    bindings: {
      url: '@',
      label: '@',
      help: '@',
    },
    controller: class UrlShareCtrl {
      url: string;
      baseUrl: string;
      fullUrl: string;

      static $inject = ['$element', '$window', 'clipboard', 'config'];
      constructor(public $element, public $window, public clipboard, public config) {
        // remove trailing slash
        this.baseUrl =
          `${$window.location.origin}${config.baseHref}`.replace(/\/$/, '');
      }

      $onChanges() {
        this.fullUrl = `${this.baseUrl}${this.url}`;
      }

      copy() {
        const input = this.$element.find('input');
        this.clipboard.copy(this.fullUrl);
        input.select();
      }
    },
    template: require('./url-share.html'),
  });
};
