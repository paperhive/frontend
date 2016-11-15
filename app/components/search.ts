'use strict';

import template from './search.html';

export default function(app) {
  app.component('search', {
    template,
    controller: class SearchCtrl {
      maxPerPage = 10;
      page = 1

      static $inject = ['config', '$http', '$location', '$scope',
        'feedbackModal', 'notificationService'];

      constructor(public config, public $http, public $location, $scope,
          public feedbackModal, public notificationService) {

        $scope.$on('$locationChangeSuccess', this.updateFromLocation.bind(this));
        this.updateFromLocation();

        $scope.$watchGroup(['$ctrl.query', '$ctrl.page'], () => {
          this.updateLocation();
          this.updateResults();
        });
      }

      scrollToTop() {
        window.scrollTo(0, 0);
      }

      // update controller variables from location
      updateFromLocation() {
        this.query = this.$location.search().query;
        this.page = this.$location.search().page || 1;
      }

      // update location from controller
      updateLocation() {
        this.$location.search({
          query: this.query,
          page: this.page > 1 ? this.page : undefined,
        });
      }


      updateResults() {
        this.documentsTotal = undefined;
        this.documents = undefined;

        return this.$http.get(`${this.config.apiUrl}/documents/search`, {
          params: {
            q: this.query,
            limit: this.maxPerPage,
            skip: (this.page - 1) * this.maxPerPage,
            restrictToLatest: true,
          },
        })
        .then(
          response => {
            this.documentsTotal = response.data.total;
            this.documents = response.data.documents;
          },
          response => {
            this.notificationService.notifications.push({
              type: 'error',
              message: 'Could not fetch documents'
            });
          }
        );
      }
    },
  });
};
