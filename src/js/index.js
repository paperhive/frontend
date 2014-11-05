(function(){
  var angular = require('angular');
  require('angular-bootstrap-tpls'); // provides 'ui.bootstrap' module
  require('angular-sanitize'); // provides 'ngSanitize' module
  require('../../tmp/templates.js'); // provides 'templates' module

  var paperhub = angular.module(
    'paperHub',
    ['ui.bootstrap', 'ngSanitize', 'templates']
  );

  require('./config')(paperhub);
  require('./directives')(paperhub);
  require('./controllers')(paperhub);
})();
