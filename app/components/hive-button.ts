'use strict';
import { findIndex, map, some } from 'lodash';

export default function(app) {
    app.component('hiveButton', {
      bindings: {
        documentId: '<',
        user: '<',
      },
      controller: [
        '$scope', '$element', '$attrs', '$http', 'config', 'notificationService',
        function($scope, $element, $attrs, $http, config, notificationService) {
          const ctrl = this;

          this.doesUserHive = false;

          // $watch on this?
          $scope.$watch('$ctrl.documentId', async function(id) {
            if (!id) { return; }
            let ret;
            try {
              ret = await $http.get(
                config.apiUrl +
                  '/documents/' + id + '/hivers'
              );
            } catch (err) {
              console.log(err);
              notificationService.notifications.push({
                type: 'error',
                message: err.data.message ? err.data.message :
                  'could not fetch hivers (unknown reason)'
              });
            }
            ctrl.hivers = ret.data.hivers;
            $scope.$watch('$ctrl.user', function(user) {
              if (user && user.id) {
                ctrl.doesUserHive = some(
                  map(ctrl.hivers, hiver => hiver.person),
                    {'id': user.id}
                );
              }
            });
            // This is an async function, so unless we $apply, angular won't
            // know that values have changed.
            $scope.$apply();
          });

          ctrl.hive = async function() {
            ctrl.submitting = true;
            try {
              await $http.post(
                config.apiUrl +
                  '/documents/' + ctrl.documentId + '/hive'
              );
            } catch (err) {
              ctrl.submitting = false;
              notificationService.httpError('could not hive document');
            }
            ctrl.submitting = false;
            ctrl.hivers.push(ctrl.user);
            ctrl.doesUserHive = true;
            // This is an async function, so unless we $apply, angular won't
            // know that values have changed.
            $scope.$apply();
          };

          ctrl.unhive = async function() {
            ctrl.submitting = true;
            try {
              await $http.delete(
                config.apiUrl +
                  '/documents/' + ctrl.documentId + '/hive'
              );
            } catch (err) {
              ctrl.submitting = false;
              notificationService.httpError('could not hive document');
            }
            ctrl.submitting = false;
            const idx = findIndex(ctrl.hivers, {id: ctrl.user.id});
            if (idx > -1) { ctrl.hivers.splice(idx, 1); }
            ctrl.doesUserHive = false;
            // This is an async function, so unless we $apply, angular won't
            // know that values have changed.
            $scope.$apply();
          };
        }],
        template:
          `<span class="btn-group" role="group">
            <button ng-if="$ctrl.doesUserHive" type="button" class="btn btn-default"
              ng-disabled="!$ctrl.user" ng-click="$ctrl.unhive()">
              <i class="fa fa-star"></i> Unhive
            </button>
            <button ng-if="!$ctrl.doesUserHive" type="button" class="btn btn-default"
              ng-disabled="!$ctrl.user" ng-click="$ctrl.hive()">
              <i class="fa fa-star"></i> Hive
            </button>
            <a href="./documents/{{$ctrl.documentId}}/hivers" class="btn btn-default">
              <span ng-if="$ctrl.hivers">{{$ctrl.hivers.length}}</span>
              <span ng-if="!$ctrl.hivers">&nbsp;</span>
            </a>
          </span>`
    });
};
