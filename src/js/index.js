(function(){
  var angular = require('angular');

  var paperhub = angular.module('paperHub', ['ui.bootstrap', 'ngSanitize']);

  require('./config')(paperhub);
  require('./directives')(paperhub);
  require('./controllers')(paperhub);
})();
