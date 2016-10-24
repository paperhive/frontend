'use strict';
import { find, findIndex, map, remove, some } from 'lodash';

export default function(app) {
    app.component('hiveButton', {
      bindings: {
        documentCtrl: '<',
        large: '<',
      },
      controller: class HiveButtonCtrl {
        submitting = false;

        static $inject = ['authService'];
        constructor(public authService) {}

        hive() {
          this.submitting = true;
          this.documentCtrl.hive().then(() => this.submitting = false);
        }

        unhive() {
          this.submitting = true;
          this.documentCtrl.unhive().then(() => this.submitting = false);
        }
      },
      template:
        `<div>
          <div ng-if="$ctrl.large" class="ph-hive-button-large btn-group" role="group">
            <button ng-if="$ctrl.documentCtrl.isUserHiver" type="button" class="btn btn-default"
              ng-disabled="$ctrl.submitting" ng-click="$ctrl.unhive()"
              title="Cancel notifications by unhiving this document."
            >
              <img alt="logo black" src="./static/img/logo-hexagon.svg"/> Unhive
            </button>
            <button ng-if="!$ctrl.documentCtrl.isUserHiver" type="button" class="btn btn-default"
              title="{{
                $ctrl.authService.user ?
                'Hive this document for receiving updates.' :
                'You have to be logged in to hive the document.'
              }}"
              ng-disabled="!$ctrl.authService.user || $ctrl.submitting"
              ng-click="$ctrl.hive()"
            >
              <img alt="logo black" src="./static/img/logo-hexagon-black.svg"/> Hive
            </button>
            <a href="./documents/{{$ctrl.documentCtrl.documentId}}/hivers"
              class="btn btn-default"
              title="Show all users who hived this document."
            >
              <span ng-if="$ctrl.documentCtrl.hivers">{{$ctrl.documentCtrl.hivers.length}}</span>
              <span ng-if="!$ctrl.documentCtrl.hivers">&nbsp;</span>
            </a>
          </div>
          <div ng-if="!$ctrl.large" class="ph-hive-button-small">
            <button ng-if="$ctrl.documentCtrl.isUserHiver" type="button" class="btn btn-link"
              ng-disabled="$ctrl.submitting" ng-click="$ctrl.unhive()"
              title="Cancel notifications by unhiving this document."
            >
              <img alt="logo black" src="./static/img/logo-hexagon.svg"/>
            </button>
            <button ng-if="!$ctrl.documentCtrl.isUserHiver" type="button" class="btn btn-link"
              title="{{
                $ctrl.authService.user ?
                'Hive this document for receiving updates.' :
                'You have to be logged in to hive the document.'
              }}"
              ng-disabled="!$ctrl.authService.user || $ctrl.submitting" ng-click="$ctrl.hive()"
            >
              <img alt="logo black" src="./static/img/logo-hexagon-black.svg"/>
            </button>
          </div>
        </div>`,
    });
};
