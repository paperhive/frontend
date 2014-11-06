(function(){
  var $ = require('jquery');
  var angular = require('angular');
  require('angular-bootstrap-tpls'); // provides 'ui.bootstrap' module
  require('angular-sanitize'); // provides 'ngSanitize' module
  require('angular-route'); // provides 'ngRoute' module
  require('../../tmp/templates.js'); // provides 'templates' module

  var paperhub = angular.module(
    'paperHub',
    ['ui.bootstrap', 'ngSanitize', 'ngRoute', 'templates']
  );

  require('./config')(paperhub);
  require('./directives')(paperhub);
  require('./controllers')(paperhub);
})();
