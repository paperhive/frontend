'use strict';

export default function(app) {
  app.component('feedbackButton', {

    controller: function($scope, $uibModal, $log) {
      $scope.open = function () {
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          template:
            `<div class="modal-header">
              <h3 class="modal-title">Feedback</h3>
            </div>
            <div class="modal-body">
              <feedback></feedback>
            </div>
            <div class="modal-footer">
              <button class="btn btn-primary" type="button" ng-click="ok()">OK</button>
              <button class="btn btn-warning" type="button" ng-click="cancel()">Cancel</button>
            </div>`,
          resolve: {
            items: function () {
              return $scope.items;
            }
          }
        });
      };
    },

    template:
    `<a type="link"
       class="ph-badge-left btn btn-primary btn-sm hidden-xs hidden-sm"
       ng-click="open()"
       >
       <i class="fa fa-fw fa-envelope"></i> Feedback
    </a>`
  });
};
