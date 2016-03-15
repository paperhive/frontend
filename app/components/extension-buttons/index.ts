'use strict';

import template from './template.html!text';

export default function(app) {
    app.component('extensionButtons', {
      controller: [
        '$scope', '$element', '$attrs', '$window',
        function($scope, $element, $attrs, $window) {
          this.isChromium = !!$window.chrome;
          this.isFirefox = $window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

          // There is more firefox code on
          // <https://developer.mozilla.org/en/docs/Installing_Extensions_and_Themes_From_Web_Pages>
          // but we didn't get this to work now.
        }],
        template
    });
};
