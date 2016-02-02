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
import 'javascript-detect-element-resize'; // injects resize+removeResize to jquery
import 'ment.io';
import 'ngSmoothScroll';                              // smoothScroll
import 'pdfjs-dist';
import 'pdfjs-dist/web/compatibility';
import 'pdfjs-dist/web/pdf_viewer';

import config from './config/index';
import controllers from './controllers/index';
import directives from './directives/index';
import services from './services/index';
import utils from './utils/index';

import '../tmp/templates.js';

System.import('./config.json!json').then(function(configJson) {
  const paperhive = angular
    .module(
      'paperhive', [
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
  controllers(paperhive);
  directives(paperhive);
  services(paperhive);
  utils(paperhive);

  console.log('Registered all modules. Bootstrapping angular...')
  angular.bootstrap(document, ['paperhive']);
});