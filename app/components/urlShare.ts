import template from './urlShare.html!text';

export default function(app) {
  app.component('urlShare', {
    bindings: {
      url: '@',
      label: '@',
    },
    controller: class UrlShareCtrl {
      static $inject = ['$window', 'config'];
      constructor(public $window, public config) {
        // remove trailing slash
        const baseUrl =
          `${$window.location.origin}${config.baseHref}`.replace(/\/$/, '');

        this.fullUrl = `${baseUrl}${this.url}`;
      }
    },
    template,
  });
};
