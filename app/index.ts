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
import 'angular-sanitize';                            // ngSanitize module
import 'angular-bootstrap';                           // ui.bootstrap
import 'angular-moment';                              // angularMoment
import 'angular-leaflet-directive';                   // leaflet-directive
import config from './config/index';
import controllers from './controllers/index';
import directives from './directives/index';
import services from './services/index';
import utils from './utils/index';

'use strict';
(function() {

  require('detect-element-resize'); // injects resize+removeResize to jquery
  require('mentio');
  require('angular-route-segment'); // provides 'route-segment' module
  require('ngSmoothScroll'); // provides 'smoothScroll' module
  require('../tmp/templates.js'); // provides 'templates' module
  require('pdfjs-compatibility');
  require('pdfjs');
  require('../bower_components/pdfjs-dist/web/pdf_viewer.js');

  const paperhive = angular
    .module(
      'paperHive', [
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
    .constant('config', require('../config.json'))
    ;

  config(paperhive);
  controllers(paperhive);
  directives(paperhive);
  services(paperhive);
  utils(paperhive);
})();