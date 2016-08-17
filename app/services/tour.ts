'use strict';

import {localStorageAvailable} from '../utils/local-storage';

export default function(app) {
  app.factory(
    'tourService',
    ['$location', '$window', 'authService',
      function($location, $window, authService) {
        const service = {
          stages: [
            'start',
            'margin-discussion',
            'highlight',
            'search',
            'hive',
            'signup'
          ],
          index: 0,
          visited: false,
        };

        // get tourVisited from localStorage
        if (localStorageAvailable) {
          service.visited = $window.localStorage.tourVisited;
        }

        service.increaseIndex = function() {
          service.index++;

          // do not show the tour next time when the last stage has been reached
          if (service.index === service.stages.length - 1 ||
              authService.user && (service.index === service.stages.length - 2)
              ) {
            service.visited = true;
            if (localStorageAvailable) {
              $window.localStorage.tourVisited = true;
            }
          }
        };

        // begin with margin discussion
        service.start = function () {
          // reset visited flag
          service.visited = false;
          if (localStorageAvailable) {
            $window.localStorage.tourVisited = false;
          }

          service.index = 1;
          $location.url('/documents/0tsHJq1-yyVZ');
        };

        service.setUndefined = function() {
          service.index = undefined;
        };

        service.reject = function() {
          service.visited = true;
          if (localStorageAvailable) {
            $window.localStorage.tourVisited = true;
          }

          service.index = undefined;
        };

        return service;
      }
    ]);
};
