'use strict';
import { findIndex, some } from 'lodash';

export default function(app) {
    app.component('starButton', {
      bindings: {
        documentId: '<',
        user: '<',
      },
      controller: [
        '$scope', '$element', '$attrs', '$http', 'config', 'notificationService',
        function($scope, $element, $attrs, $http, config, notificationService) {
          const ctrl = this;

          this.doesUserStar = false;

          // $watch on this?
          $scope.$watch('$ctrl.documentId', async function(id) {
            if (!id) { return; }
            let ret;
            try {
              ret = await $http.get(
                config.apiUrl +
                  '/documents/' + id + '/stars'
              );
            } catch (err) {
              console.log(err);
              notificationService.notifications.push({
                type: 'error',
                message: err.data.message ? err.data.message :
                  'could not fetch stars (unknown reason)'
              });
            }
            ctrl.stars = ret.data.stars;
            $scope.$watch('$ctrl.user', function(user) {
              if (user && user.id) {
                ctrl.doesUserStar = some(ctrl.stars, {'id': user.id});
              }
            });
          });

          ctrl.star = async function() {
            ctrl.submitting = true;
            try {
              await $http.post(
                config.apiUrl +
                  '/documents/' + ctrl.documentId + '/star'
              )
            } catch (err) {
              ctrl.submitting = false;
              notificationService.httpError('could not star document');
            }
            ctrl.submitting = false;
            ctrl.stars.push(ctrl.user);
            ctrl.doesUserStar = true;
          };

          ctrl.unstar = async function() {
            ctrl.submitting = true;
            try {
              await $http.delete(
                config.apiUrl +
                  '/documents/' + ctrl.documentId + '/star'
              )
            } catch(err) {
              ctrl.submitting = false;
              notificationService.httpError('could not star document');
            }
            ctrl.submitting = false;
            const idx = findIndex(ctrl.stars, {id: ctrl.user.id});
            if (idx > -1) { ctrl.stars.splice(idx, 1); }
            ctrl.doesUserStar = false;
          };
        }],
        template:
          `<span class="btn-group" role="group">
            <button ng-if="$ctrl.doesUserStar" type="button" class="btn btn-default"
              ng-disabled="!$ctrl.user" ng-click="$ctrl.unstar()">
              <i class="fa fa-star"></i> Unstar
            </button>
            <button ng-if="!$ctrl.doesUserStar" type="button" class="btn btn-default"
              ng-disabled="!$ctrl.user" ng-click="$ctrl.star()">
              <i class="fa fa-star"></i> Star
            </button>
            <button type="button" class="btn btn-default" disabled>
              <span ng-if="$ctrl.stars">{{$ctrl.stars.length}}</span>
              <span ng-if="!$ctrl.stars">&nbsp;</span>
            </button>
          </span>`
    });
};
