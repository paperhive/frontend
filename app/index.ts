/*!
 * PaperHive (https://paperhive.org)
 * Copyright 2014-2016 André Gaul <andre@paperhive.org>,
 *                     Nico Schlömer <nico@paperhive.org>
 * Licensed under GPL3
 * (https://github.com/paperhive/paperhive-frontend/blob/master/LICENSE)
 */
import 'core-js/shim';

// import jquery before angular (so angular can use it instead of jqlite)
import 'jquery';

// Rangy needs to be included after the initial DOM
// and, importantly, BEFORE angular. This is because rangy needs to call
// `rangy.init()` for the core rangy object to work (which is used
// in some controllers, i.e., by angular).
import 'rangy';
import 'rangy/rangy-serializer';
import 'rangy/rangy-textrange';

import * as angular from 'angular';
import 'angular-animate';                             // ngAnimate module
import 'angular-route';                               // ngRoute module
import 'angular-route-segment';                       // route-segment
import 'angular-sanitize';                            // ngSanitize module
import 'angular-bootstrap';                           // ui.bootstrap
import angularChartist from 'angular-chartist.js';    // chartist.js
import 'angular-moment';                              // angularMoment
import 'angular-leaflet-directive';                   // leaflet-directive
import 'angulartics';
import 'angulartics-google-analytics';
import 'javascript-detect-element-resize'; // injects resize+removeResize to jquery
import 'pdfjs-dist/web/compatibility';
import 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer';

import config from './config/index';
import components from './components/index';
import directives from './directives/index';
import filters from './filters/index';
import services from './services/index';
import utils from './utils/index';

import '../build-tmp/html.js';
import configJson from '../config.json';

export const paperhive = angular
  .module(
    'paperhive', [
      'angulartics',
      'angulartics.google.analytics',
      angularChartist,
      'ui.bootstrap',
      'ngAnimate',
      'ngSanitize',
      'ngRoute',
      'route-segment',
      'view-segment',
      'angularMoment',
      'leaflet-directive',
      'templates'
    ]
  )
  .constant('config', configJson)
  ;

config(paperhive);
components(paperhive);
directives(paperhive);
filters(paperhive);
services(paperhive);
utils(paperhive);

angular.bootstrap(document, ['paperhive'], {strictDi: true});
