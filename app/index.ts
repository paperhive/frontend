/*!
 * PaperHive (https://paperhive.org)
 * Copyright 2014-2017 André Gaul <andre@paperhive.org>,
 *                     Nico Schlömer <nico@paperhive.org>
 * Licensed under GPL3
 * (https://github.com/paperhive/paperhive-frontend/blob/master/LICENSE)
 */

// include less
require('../less/index.less');

// import jquery before angular (so angular can use it instead of jqlite)
import 'jquery';

// Rangy needs to be included after the initial DOM
// and, importantly, BEFORE angular. This is because rangy needs to call
// `rangy.init()` for the core rangy object to work (which is used
// in some controllers, i.e., by angular).
import 'rangy';
import 'rangy/lib/rangy-serializer';
import 'rangy/lib/rangy-textrange';

// dependency of ui-leaflet (global variable *facepalm*)
import 'leaflet';

// official angular modules
import { bootstrap, module } from 'angular';
import ngAnimate from 'angular-animate';    // ngAnimate module
import ngMessages from 'angular-messages';  // ngMessages module
import ngRoute from 'angular-route';        // ngRoute module
import ngSanitize from 'angular-sanitize';  // ngSanitize module

// properly exported modules
import angularChartist from 'angular-chartistjs'; // chartist.js
import 'angular-route-segment';                  // route-segment, view-segment
import 'angular-ui-bootstrap';                   // ui.bootstrap
import 'angular-moment';                         // angularMoment
import 'angular-simple-logger';                  // nemLogger (dependency of ui-leaflet)
import 'ui-leaflet';                             // ui-leaflet
import 'angulartics';                            // angulartics
import 'angulartics-google-analytics';
import 'javascript-detect-element-resize/jquery.resize.js';       // injects resize+removeResize to jquery
import 'pdfjs-dist/web/compatibility';
import 'pdfjs-dist';

import config from './config/index';
import components from './components/index';
import directives from './directives/index';
import filters from './filters/index';
import services from './services/index';
import utils from './utils/index';

export const paperhive = module(
    'paperhive', [
      ngAnimate,
      ngMessages,
      ngRoute,
      ngSanitize,
      angularChartist,
      'route-segment',
      'view-segment',
      'ui.bootstrap',
      'angularMoment',
      'nemLogging',
      'ui-leaflet',
      'angulartics',
      'angulartics.google.analytics',
    ],
  )
  .constant('config', (<any> window).paperhiveConfig)
  ;

config(paperhive);
components(paperhive);
directives(paperhive);
filters(paperhive);
services(paperhive);
utils(paperhive);
