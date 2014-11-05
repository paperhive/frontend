(function(){
  var angular = require('angular');
  require('angular-bootstrap');
  require('angular-sanitize');

  var paperhubTemplates = require('../../tmp/templates.js'); // browserify shim
  var paperhub = angular.module(
    'paperHub',
    ['ui.bootstrap', 'ngSanitize', 'templates']
  );


  require('./config')(paperhub);
  require('./directives')(paperhub);
  require('./controllers')(paperhub);
})();
