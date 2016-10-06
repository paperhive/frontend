'use strict';
import { find, findIndex, map, remove, some } from 'lodash';

export default function(app) {
    app.component('hiveButton', {
      bindings: {
        documentId: '<',
      },
      controller: class HiveButtonCtrl {
        static $inject = ['$scope', '$http', 'authService', 'config', 'notificationService'];
        constructor($scope, public $http, public authService, public config, public notificationService) {
          $scope.$watch('$ctrl.documentId', documentId => {
            if (!documentId) {
              this.hivers = undefined;
              return;
            }
            this.$http.get(`${this.config.apiUrl}/documents/${documentId}/hivers`)
              .then(
                response => this.hivers = response.data.hivers,
                this.notificationService.httpError('could not fetch hivers')
              );
          });

          $scope.$watchCollection('$ctrl.hivers', this.updateDoesUserHive.bind(this));
          $scope.$watch('$ctrl.authService.user', this.updateDoesUserHive.bind(this));
        }

        updateDoesUserHive() {
          if (!this.hivers || !this.authService.user) {
            this.doesUserHive = false;
            return;
          }
          this.doesUserHive = !!find(this.hivers, {person: {id: this.authService.user.id}});
        }

        hive() {
          this.submitting = true;
          this.$http.post(`${this.config.apiUrl}/documents/${this.documentId}/hive`)
            .then(
              () => {
                this.submitting = false;
                this.hivers.push({
                  hivedAt: new Date(),
                  person: this.authService.user,
                });
              },
              this.notificationService.httpError('could not unhive document')
            );
        }

        unhive() {
          this.submitting = true;
          this.$http.delete(`${this.config.apiUrl}/documents/${this.documentId}/hive`)
            .then(
              () => {
                this.submitting = false;
                remove(this.hivers, {person: {id: this.authService.user.id}});
              },
              this.notificationService.httpError('could not hive document')
            );
          };
        },
        template:
          `<div class="btn-group" role="group"
              title="{{$ctrl.authService.user ? 'Hive this document for receiving updates.' : 'You have to be logged in to hive the document.'}}"
          >
            <button ng-if="$ctrl.doesUserHive" type="button" class="btn btn-default"
              ng-disabled="!$ctrl.authService.user || $ctrl.submitting" ng-click="$ctrl.unhive()">
              <img alt="logo black" height="20px" src="./static/img/logo-hexagon.svg"/> Unhive
            </button>
            <button ng-if="!$ctrl.doesUserHive" type="button" class="btn btn-default"
              ng-disabled="!$ctrl.authService.user || $ctrl.submitting" ng-click="$ctrl.hive()">
              <img alt="logo black" height="20px" src="./static/img/logo-hexagon-black.svg"/> Hive
            </button>
            <a href="./documents/{{$ctrl.documentId}}/hivers" class="btn btn-default">
              <span ng-if="$ctrl.hivers">{{$ctrl.hivers.length}}</span>
              <span ng-if="!$ctrl.hivers">&nbsp;</span>
            </a>
          </span>`
    });
};
