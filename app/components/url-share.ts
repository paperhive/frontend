import template from './url-share.html';

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

      static $inject = ['$window', 'config'];
      constructor(public $window, public config) {
        // remove trailing slash
        this.baseUrl =
          `${$window.location.origin}${config.baseHref}`.replace(/\/$/, '');
      }

      $onChanges() {
        this.fullUrl = `${this.baseUrl}${this.url}`;
      }
    },
    template,
  });
};
