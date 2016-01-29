/*!
 * PaperHive (https://paperhive.org)
 * Copyright 2014-2015 André Gaul <andre@paperhive.org>,
 *                     Nico Schlömer <nico@paperhive.org>
 * Licensed under GPL3
 * (https://github.com/paperhive/paperhive-frontend/blob/master/LICENSE)
 */

import * as angular from 'angular';

import config from './config';
import controllers from './controllers';
import directives from './directives';
import services from './services';
import utils from './utils';

'use strict';
(function() {
  // Rangy needs to be included after the initial DOM
  // and, importantly, BEFORE angular. This is because rangy needs to call
  // `rangy.init()` for the core rangy object to work (which is used
  // in some controllers, i.e., by angular).
  require('rangy');
  require('rangy-serializer');

  require('angular-animate'); // provides 'ngAnimate' module
  require('angular-bootstrap-tpls'); // provides 'ui.bootstrap' module
  require('angular-sanitize'); // provides 'ngSanitize' module
  require('angular-route'); // provides 'ngRoute' module
  require('angular-moment');
  require('angular-leaflet-directive'); // provides 'leaflet-directive' module
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
