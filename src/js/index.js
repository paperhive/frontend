'use strict';
(function() {

  // Rangy needs to be included after the initial DOM
  // and, importantly, BEFORE angular. This is because rangy needs to call
  // `rangy.init()` for the core rangy object to work (which is used
  // in some controllers, i.e., by angular).
  require('rangy');
  require('rangy-serializer');

  var angular = require('angular');
  require('angular-animate'); // provides 'ngAnimate' module
  require('angular-bootstrap-tpls'); // provides 'ui.bootstrap' module
  require('angular-sanitize'); // provides 'ngSanitize' module
  require('angular-strap-affix'); // provides 'mgcrea.ngStrap.affix' module
  require('angular-strap-debounce'); // provides 'mgcrea.ngStrap.helpers.debounce' module
  require('angular-strap-dimensions'); // provides 'mgcrea.ngStrap.helpers.dimensions' module
  require('angular-strap-scrollspy'); // provides 'mgcrea.ngStrap.scrollspy' module
  require('angular-route'); // provides 'ngRoute' module
  require('angular-moment');
  require('detect-element-resize'); // injects resize+removeResize to jquery
  require('mentio');
  require('angular-route-segment'); // provides 'route-segment' module
  require('../../tmp/templates.js'); // provides 'templates' module
  require('pdfjs');
  require('../../bower_components/pdfjs-dist/web/pdf_viewer.js');

  var paperhub = angular
    .module(
      'paperHub',
      [
       'ui.bootstrap',
       'mentio',
       'ngAnimate',
       'ngSanitize',
       'ngRoute',
       'route-segment',
       'view-segment',
       'angularMoment',
       'templates',
       'mgcrea.ngStrap.affix',
       'mgcrea.ngStrap.scrollspy'
      ]
    )
    .constant('config', require('../../config.json'))
    ;

  require('./config')(paperhub);
  require('./controllers')(paperhub);
  require('./directives')(paperhub);
  require('./services')(paperhub);
  require('./utils')(paperhub);
})();
