import * as jquery from 'jquery';
import { defaults, isNumber, isString } from 'lodash';

export default function(app) {
  app.service('scroll', class Scroll {
    static $inject = ['$document', '$window'];

    constructor(public $document, public $window) {}

    private static preventDefault(event) {
      event.preventDefault();
    }

    // the following types are supported for target:
    //   Number: pixels from top -> scroll to given position
    //   String: jquery selector -> scroll to first matching element
    //   HTMLElement: scroll to given DOM element
    public async scrollTo(target, _options) {
      const options = defaults({}, _options, {
        duration: 400,
        offset: 0,
      });

      let top;
      if (isNumber(target)) {
        top = target;
      } else if (isString(target)) {
        const element = jquery(target);
        if (!element) throw new Error(`No element matching ${target}`);
        top = element.offset().top;
      } else {
        if (!target) throw new Error('No element provided');
        top = jquery(target).offset().top;
      }

      if (options.before) options.before();

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

      if (options.after) options.after();
    }
  });
};
