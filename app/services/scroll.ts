import jquery from 'jquery';
import { defaults } from 'lodash';

export default function(app) {
  app.service('scroll', class Scroll {
    static $inject = ['$window'];

    constructor(public $window) {}

    private static preventWheel(e) {
      e.preventDefault();
    }

    public async scrollTo(element, _options) {
      const options = defaults({}, _options, {
        duration: 400,
        offset: 0,
      });

      // disable mouse wheel scrolling while scrollTo is running
      jquery(this.$window).on('wheel', Scroll.preventWheel);

      // scroll smooth
      await new Promise((resolve, reject) => {
        jquery('html, body').animate({
          scrollTop: jquery(element).offset().top - options.offset,
        }, {
          complete: resolve,
          duration: options.duration,
        });
      });

      // re-enable mouse wheel scrolling
      jquery(this.$window).off('wheel', Scroll.preventWheel);
    }
  });
};
