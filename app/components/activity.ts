'use strict';

import template from './activity.html';

export default function(app) {
  app.component('activity', {
    bindings: {
      filterMode: '@',
      filterId: '<',
    },
    controller: class Activity {
      static $inject = ['$http', '$scope', 'authService', 'config', 'notificationService'];
      constructor(public $http, public $scope, public authService, public config, public notificationService) {
        $scope.$watch('$ctrl.authService.user', this.refresh.bind(this));
      }

      refresh() {
        this.activities = undefined;
        this.person = undefined;

        const params = {};
        switch (this.filterMode) {
          case 'channel':
          case 'document':
          case 'person':
            // don't do anything if the filterId is falsy
            if (!this.filterId) return;
            params[this.filterMode] = this.filterId;
            break;
          case undefined:
            break;
          default:
            throw new Error(`unknown filter mode ${this.filterMode}`);
        }

        this.$http.get(`${this.config.apiUrl}/activities/`, {params})
          .then(
            response => this.activities = response.data.activities,
            this.notificationService.httpError('could not fetch activities (unknown reason)')
          );

        // fetch person if person filter is active
        if (this.filterMode === 'person') {
          this.$http.get(`${this.config.apiUrl}/people/${this.filterId}`)
            .then(
              response => this.person = response.data,
              this.notificationService.httpError('could not fetch person (unknown reason)')
            );
        }
      }

      $onChanges() {
        this.refresh();
      }

    },
    template,
  });
};
