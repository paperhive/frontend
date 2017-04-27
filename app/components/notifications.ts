export default function(app) {
  app.component('notifications', {
    controller: ['$element', '$scope', 'notificationService',
      function($element, $scope, notificationService) {
        $scope.notifications = notificationService.notifications;

        $scope.$watchCollection(
          'notifications',
          notifications => $scope.notification = notifications && notifications.length > 0
            ? notifications[notifications.length - 1] : undefined,
        );

        $scope.close = () => notificationService.notifications.pop();
        $element.on('click', event => $scope.$apply(() => {
          if (event.target.href) $scope.close();
        }));
      },
    ],
    template: require('./notifications.html'),
  });
};
