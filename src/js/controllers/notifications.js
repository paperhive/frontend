module.exports = function (app) {
  app.controller('NotificationsCtrl', ['$scope', 'NotificationsService', 
    function ($scope, notificationsService) {
      $scope.notifications = notificationsService.notifications;
      $scope.close = function (index) {
        notificationsService.notifications.splice(index, 1);
      };
      $scope.types = {
        'error': 'danger',
        'info': 'info',
        'warning': 'warning',
        'success': 'success'
      };
    }
  ]);
};
