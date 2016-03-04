'use strict';

export default function(app) {
    app.component('extensionButtons', {
      controller: [
        '$scope', '$element', '$attrs', '$window',
        function($scope, $element, $attrs, $window) {
          $scope.isChromium = !!$window.chrome;
          $scope.isFirefox = $window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

          // from
          // https://developer.mozilla.org/en/docs/Installing_Extensions_and_Themes_From_Web_Pages
          $scope.firefoxAddonInstall = function(aEvent) {
            for ( let a = aEvent.target; a.href === undefined; ) a = a.parentNode;
            const params = {
              'PaperHive': {
                URL: aEvent.target.xpiUrl,
                IconURL: aEvent.target.getAttribute('iconURL'),
                toString: function () { return this.URL; }
              }
            };
            InstallTrigger.install(params);
            return false;
          };
        }],
        template: `
          <div ng-if="isChromium">
            <a ng-if="isChromium"
               class="btn btn-primary btn-block ph-margin-bottom-10"
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
            <a class="ph-font-size-small"
               href="https://addons.mozilla.org/en-US/firefox/addon/paperhive/">
              Also available for Mozilla Firefox.
            </a>
          </div>
          <div ng-if="isFirefox">
            <a class="btn btn-primary btn-block ph-margin-bottom-10"
               href="https://addons.mozilla.org/en-US/firefox/addon/paperhive/"
               xpiUrl="https://addons.mozilla.org/firefox/downloads/file/405251/paperhive-fx.xpi"
               iconURL="/static/img/firefox.svg"
               onclick="return firefoxAddonInstall(event);"
               >
              <img
                alt="Firefox logo"
                width="30px"
                src="./static/img/firefox.svg"
                >
              Add to Firefox
            </a>
            <a class="ph-font-size-small"
               href="https://chrome.google.com/webstore/detail/paperhive/fihafdlllifbanclcjljledeifcdjbok">
              Also available for Google Chrome.
            </a>
          </div>
          <span ng-if="!isChromium && !isFirefox">
            Only available for <a href="https://chrome.google.com/webstore/detail/paperhive/fihafdlllifbanclcjljledeifcdjbok">
            Google Chrome</a> and <a href="https://addons.mozilla.org/en-US/firefox/addon/paperhive/">Mozilla Firefox</a>.
          </span>`
    });
};
