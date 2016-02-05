'use strict';

import * as angular from 'angular';

export default function(app) {
  app.controller('ContactMapCtrl', ['$scope', function($scope) {
    const office = {
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
          message: '<h4 class="ph-no-margin-top">' +
            'PaperHive office ' +
            '<small class="ph-newline">Room ACK390, Entrance H</small>' +
            '</h4>' +
            'Ackerstr. 76<br/>13355 Berlin<br/>Germany',
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
