'use strict';

export default function(app) {
  app.component('feedbackButton', {

    controller: function($scope, $uibModal) {
      $scope.open = function () {
        var modalInstance = $uibModal.open({
          animation: true,
          template:
            `<div class="modal-header">
              <h3 class="modal-title">Feedback</h3>
            </div>
            <div class="modal-body">
              <feedback></feedback>
            </div>
            <div class="modal-footer">
              <button class="btn btn-default" type="button" ng-click="discard()">
                <i class="fa fa-times" aria-hidden="true"></i>
                Discard
              </button>
              <button class="btn btn-primary" type="button" ng-click="send()">
                <i class="fa fa-paper-plane" aria-hidden="true"></i>
                Send
              </button>
            </div>`
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
