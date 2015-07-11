'use strict';

var angular = require('angular');

module.exports = function(app) {
  app.controller('ContactMapCtrl', ['$scope', function($scope) {
    var office = {
      lat: 52.53849,
      lng: 13.38520
    };
    angular.extend($scope, {
      center: {
        lat: office.lat,
        lng: office.lng,
        zoom: 12
      },
      markers: {
        officeMarker: {
          lat: office.lat,
          lng: office.lng,
          focus: true,
          message: '<h4 class="ph-no-margin-top">PaperHive office</h4>' +
            'Ackerstr. 76<br/>Room ACK390<br/>13355 Berlin<br/>Germany',
          draggable: false
        }
      }
    });
  }]);

  /*
  app.controller('ContactFormCtrl', [
    '$scope', 'authService',
    function($scope, authService) {
      $scope.auth = authService;
    }
  ]);
  */

};
