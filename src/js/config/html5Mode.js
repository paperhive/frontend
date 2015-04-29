'use strict';
module.exports = function(app) {
  app.config(
    ['$locationProvider', function($locationProvider) {
      $locationProvider.html5Mode({
        enabled: true,
        requireBase: true
      });
    }
  ]);
};
