'use strict';

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
        template: `
          <div ng-if="$ctrl.isChromium">
            <a class="btn btn-primary btn-block ph-md-margin-bottom"
               href="https://chrome.google.com/webstore/detail/paperhive/fihafdlllifbanclcjljledeifcdjbok"
               onclick="chrome.webstore.install();return false;"
               >
              <img
                alt="Chrome logo"
                width="30px"
                src="./static/img/chrome.svg"
                >
              Add to Chrome
            </a>
            <a href="https://addons.mozilla.org/en-US/firefox/addon/paperhive/">
              <small>Also available for Mozilla Firefox.</small>
            </a>
          </div>
          <div ng-if="$ctrl.isFirefox">
            <a class="btn btn-primary btn-block ph-md-margin-bottom"
               href="https://addons.mozilla.org/en-US/firefox/addon/paperhive/"
               >
              <img
                alt="Firefox logo"
                width="30px"
                src="./static/img/firefox.svg"
                >
              Add to Firefox
            </a>
            <a href="https://chrome.google.com/webstore/detail/paperhive/fihafdlllifbanclcjljledeifcdjbok">
              <small>Also available for Google Chrome.</small>
            </a>
          </div>
          <span ng-if="!$ctrl.isChromium && !$ctrl.isFirefox">
            Only available for <a href="https://chrome.google.com/webstore/detail/paperhive/fihafdlllifbanclcjljledeifcdjbok">
            Google Chrome</a> and <a href="https://addons.mozilla.org/en-US/firefox/addon/paperhive/">Mozilla Firefox</a>.
          </span>`
    });
};
