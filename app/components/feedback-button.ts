'use strict';

export default function(app) {
  app.component('feedbackButton', {

    controller: ['$scope', '$uibModal', function($scope, $uibModal) {
      $scope.open = function () {
        var modalInstance = $uibModal.open({
          animation: true,
          template: '<feedback on-cancel="close()" on-submitted="close()"></feedback>',
          controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
            $scope.close = function () {
              $uibModalInstance.close();
            }
          }],
        });
      };
    }],

    template:
    `<a type="link"
       class="ph-badge-left btn btn-primary btn-sm hidden-xs hidden-sm"
       ng-click="open()"
       >
       <i class="fa fa-fw fa-envelope"></i> Feedback
    </a>`
  });
};
