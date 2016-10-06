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
          async function updateHives() {
            if (!ctrl.documentId) { return; }
            let ret;
            try {
              ret = await $http.get(
                config.apiUrl +
                  '/documents/' + ctrl.documentId + '/hivers'
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

            ctrl.doesUserHive = ctrl.user && ctrl.user.id &&
              ctrl.hivers.map(hiver => hiver.person.id).indexOf(ctrl.user.id) !== -1;

            // This is an async function, so unless we $apply, angular won't
            // know that values have changed.
            $scope.$apply();
          }
          $scope.$watchGroup(['$ctrl.documentId', '$ctrl.user'], updateHives);

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
            ctrl.hivers.push({
              hivedAt: new Date(),
              person: ctrl.user,
            });
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
            const idx = findIndex(
              map(ctrl.hivers, hiver => hiver.person),
              {id: ctrl.user.id}
              );
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
              <img alt="logo black" height="20px" src="./static/img/logo-hexagon-black.svg"/> Unhive
            </button>
            <button ng-if="!$ctrl.doesUserHive" type="button" class="btn btn-default"
              ng-disabled="!$ctrl.user" ng-click="$ctrl.hive()">
              <img alt="logo black" height="20px" src="./static/img/logo-hexagon-black.svg"/> Hive
            </button>
            <a href="./documents/{{$ctrl.documentId}}/hivers" class="btn btn-default">
              <span ng-if="$ctrl.hivers">{{$ctrl.hivers.length}}</span>
              <span ng-if="!$ctrl.hivers">&nbsp;</span>
            </a>
          </span>`
    });
};
