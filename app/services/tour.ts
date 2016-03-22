'use strict';
export default function(app) {
  app.factory(
    'tourService',
    [
      function() {
        const service = {
          stages: ['welcome', 'discussion', 'pdf', 'search', 'follow', 'signUp'],
          index: 0,
        };

        service.increaseIndex = function() {
          service.index++;
        }

        service.setUndefined = function() {
          service.index = undefined;
        }

        return service;
      }
    ]);
};
