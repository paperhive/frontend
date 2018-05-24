import { element } from 'angular';

import {localStorageAvailable} from '../utils/local-storage';

export default function(app) {
  app.service('analyticsService', class AnalyticsService {
    enabled = false;
    askForConsent = false;
    gaElement: JQLite;

    static $inject = ['$analytics', '$document', '$location', '$window'];
    constructor(public $analytics, public $document, public $location, public $window) {
      if (localStorageAvailable && this.$window.localStorage.analyticsEnabled) {
        this.enable();
      }
    }

    askForConsentIfRequired() {
      if (!this.enabled) this.askForConsent = true;
    }

    enable() {
      if (this.enabled) return;

      // initialize GA if not yet done
      if (!this.gaElement) {
        // customized version of GA snippet where the script is not loaded
        function setGaKey(window, key) {
          window.GoogleAnalyticsObject = key;
          window[key] = window[key] || function() {
            (window[key].q = window[key].q || []).push(arguments);
          }, window[key].l = 1 * (new Date() as any);
        }

        setGaKey(this.$window, 'ga');
        this.$window.ga('create', 'UA-62775822-1', 'auto');
        this.$window.ga('set', 'anonymizeIp', true);
        this.$window.ga('set', 'forceSSL', true);

        this.gaElement = element(`<script async src="//www.google-analytics.com/analytics.js"></script>`);
        this.gaElement.appendTo(this.$document[0].head);
      }

      if (this.$analytics.getOptOut()) {
        this.$analytics.setOptOut(false);
        const url = this.$analytics.settings.pageTracking.basePath + this.$location.url();
        this.$analytics.pageTrack(url);
      }

      this.enabled = true;
      if (localStorageAvailable) {
        this.$window.localStorage.analyticsEnabled = true;
      }
      this.askForConsent = false;
    }

    disable() {
      if (!this.enabled) return;

      this.$analytics.setOptOut(true);

      this.enabled = false;
      if (localStorageAvailable) {
        this.$window.localStorage.analyticsEnabled = false;
      }
    }
  });
}
