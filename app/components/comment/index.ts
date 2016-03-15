import { cloneDeep } from 'lodash';
import * as angular from 'angular';

import template from './template.html!text';

export default function(app) {
  app.component(
    'comment', {
      bindings: {
        content: '<',
        onDelete: '&',
        onUpdate: '&',
        requiresBody: '<',
        deletable: '<'
      },
      template,
      controller: [
        '$scope', 'authService', '$window',
        function($scope, authService, $window) {
          const ctrl = this;

          // expose a bunch of variables in the scope
          $scope.auth = authService;
          $scope.editMode = false;
          $scope.requiresBody = this.requiresBody;
          $scope.deletable = this.deletable;
          $scope.$watch('$ctrl.content', function(content) {
            $scope.comment = cloneDeep(content);
          });

          $scope.getUserText = function(item) {
            // return '<strong><a href='./users/' + item.userName + ''>@' + item.userName + '</a></strong>';
            return '@' + item.userName;
          };

          // For a more advanced example, using promises, see
          // <https://github.com/jeff-collins/ment.io/blob/master/ment.io/scripts.js>.
          $scope.searchUsers = function(term) {
            // Fill localItems, used as mentio-items in the respective directive.
            const results = [];
            angular.forEach($scope.users, function(item) {
              if (item.userName.toUpperCase().indexOf(term.toUpperCase()) >= 0) {
                results.push(item);
              }
            });
            $scope.localItems = results;
          };

          // Needed for access from child scope
          $scope.cancel = function() {
            $scope.editMode = false;
            $scope.comment = cloneDeep(ctrl.content);
          };

          $scope.update = function() {
            $scope.submitting = true;
            const promise = ctrl.onUpdate({$comment: ctrl.content});
            if (promise) {
              promise.finally(function() {
                $scope.submitting = false;
                $scope.editMode = false;
              });
            }
          };

          $scope.delete = function() {
            $scope.submitting = true;
            const promise = ctrl.onDelete({$comment: ctrl.content});
            if (promise) {
              promise.finally(function() {
                $scope.submitting = false;
                $scope.editMode = false;
              });
            }
          };
          // $scope.annotationBody = null;
          // $scope.isEditMode = false;
          //
          // Warn on page close if there still is unsaved text in the reply form.
          $scope.$on('$locationChangeStart', function(event) {
            if ($scope.editMode && ctrl.content.body !== $scope.comment.body) {
              const answer = $window.confirm(
                'There is unsaved content in the reply field. ' +
                  'Are you sure you want to leave this page?'
              );
              if (!answer) {
                event.preventDefault();
              }
            }
          });
        }]
    }
  );
};
