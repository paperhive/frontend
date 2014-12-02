(function(){
  var $ = require('jquery');
  var angular = require('angular');
  require('angular-bootstrap-tpls'); // provides 'ui.bootstrap' module
  require('angular-sanitize'); // provides 'ngSanitize' module
  require('angular-route'); // provides 'ngRoute' module
  require('../../bower_components/moment/moment.js');
  require('angular-moment');
  require('angular-route-segment'); // provides 'route-segment' module
  require('../../tmp/templates.js'); // provides 'templates' module

  var paperhub = angular
    .module(
      'paperHub',
      [
       'ui.bootstrap',
       'ngSanitize',
       'ngRoute',
       'route-segment',
       'view-segment',
       'angularMoment', // https://github.com/urish/angular-moment
       'templates'
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
