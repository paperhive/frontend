(function(){
  var angular = require('angular');
  require('angular-bootstrap-tpls'); // provides 'ui.bootstrap' module
  require('angular-sanitize'); // provides 'ngSanitize' module
  require('angular-route'); // provides 'ngRoute' module
  require('angular-moment');
  require('../../bower_components/ment.io/dist/mentio.js');
  require('angular-route-segment'); // provides 'route-segment' module
  require('../../tmp/templates.js'); // provides 'templates' module
  require('../../bower_components/pdfjs-dist/build/pdf.js');
  require('../../bower_components/pdfjs-dist/web/pdf_viewer.js');

  var paperhub = angular
    .module(
      'paperHub',
      [
       'ui.bootstrap',
       'mentio',
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
