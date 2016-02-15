/*!
 * PaperHive (https://paperhive.org)
 * Copyright 2014-2015 André Gaul <andre@paperhive.org>,
 *                     Nico Schlömer <nico@paperhive.org>
 * Licensed under GPL3
 * (https://github.com/paperhive/paperhive-frontend/blob/master/LICENSE)
 */

// import jquery before angular (so angular can use it instead of jqlite)
import 'jquery';

// Rangy needs to be included after the initial DOM
// and, importantly, BEFORE angular. This is because rangy needs to call
// `rangy.init()` for the core rangy object to work (which is used
// in some controllers, i.e., by angular).
import 'rangy';
import 'rangy/rangy-serializer';

import * as angular from 'angular';
import 'angular-animate';                             // ngAnimate module
import 'angular-route';                               // ngRoute module
import 'angular-route-segment';                       // route-segment
import 'angular-sanitize';                            // ngSanitize module
import 'angular-bootstrap';                           // ui.bootstrap
import 'angular-moment';                              // angularMoment
import 'angular-leaflet-directive';                   // leaflet-directive
import 'angulartics';
import angularGoogleAnalytics from 'angulartics-google-analytics';
import 'javascript-detect-element-resize'; // injects resize+removeResize to jquery
import 'ment.io';
import 'ngSmoothScroll';                              // smoothScroll
import 'pdfjs-dist/web/compatibility';
import 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer';

import config from './config/index';
import components from './components/index';
import controllers from './controllers/index';
import directives from './directives/index';
import services from './services/index';
import utils from './utils/index';

import '../build-tmp/html.js';
import configJson from '../config.json!json';

// Google Analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', configJson.gaTrackingId, 'auto');
// Commented out as of
// <https://github.com/angulartics/angulartics-google-analytics#changes-in-the-google-analytics-snippet>.
// ga('send', 'pageview');

const paperhive = angular
  .module(
    'paperhive', [
      'angulartics',
      angularGoogleAnalytics,
      'ui.bootstrap',
      'mentio',
      'ngAnimate',
      'ngSanitize',
      'ngRoute',
      'route-segment',
      'view-segment',
      'smoothScroll',
      'angularMoment',
      'leaflet-directive',
      'templates'
    ]
  )
  .constant('config', configJson)
  ;

config(paperhive);
components(paperhive);
controllers(paperhive);
directives(paperhive);
services(paperhive);
utils(paperhive);

angular.bootstrap(document, ['paperhive']);
