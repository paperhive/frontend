import jquery from 'jquery';
import { defaults, isNumber } from 'lodash';

export default function(app) {
  app.service('scroll', class Scroll {
    static $inject = ['$window'];

    constructor(public $window) {}

    private static preventDefault(event) {
      event.preventDefault();
    }

    public async scrollTo(target, _options) {
      const options = defaults({}, _options, {
        duration: 400,
        offset: 0,
      });

      const top = isNumber(target) ? target : jquery(target).offset().top;

      // disable mouse wheel scrolling while scrollTo is running
      jquery(this.$window).on('wheel', Scroll.preventDefault);

      // scroll smooth
      await new Promise((resolve, reject) => {
        jquery('html, body').animate({
          scrollTop: top - options.offset,
        }, {
          complete: resolve,
          duration: options.duration,
        });
      });

      // re-enable mouse wheel scrolling
      jquery(this.$window).off('wheel', Scroll.preventDefault);
    }
  });
};
