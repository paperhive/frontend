'use strict';
export default function(app) {
  app.controller(
    'NavbarCtrl',
    ['$scope', '$location',
      function($scope, $location) {
        $scope.collapsed = true;
      }]);
};
