(function(){
  var $ = require('jquery');
  var angular = require('angular');
  require('angular-bootstrap-tpls'); // provides 'ui.bootstrap' module
  require('angular-sanitize'); // provides 'ngSanitize' module
  require('angular-route'); // provides 'ngRoute' module
  require('../../bower_components/angular-route-segment/build/angular-route-segment.js'); // provides 'route-segment' module
  require('../../tmp/templates.js'); // provides 'templates' module

  var paperhub = angular
    .module(
      'paperHub',
      ['ui.bootstrap', 'ngSanitize',
       'ngRoute', 'route-segment', 'view-segment',
       'templates']
    )
    .constant('config', require('../../config.json'))
    ;

  require('./config')(paperhub);
  require('./controllers')(paperhub);
  require('./directives')(paperhub);
  require('./services')(paperhub);
})();
