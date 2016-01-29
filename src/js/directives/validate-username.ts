'use strict';
module.exports = function(app) {
  // see https://docs.angularjs.org/guide/forms
  app.directive('validateUsername', [
    '$q', '$http', 'config', 'authService',
    function($q, $http, config, authService) {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
          ctrl.$asyncValidators.username = function(modelValue, viewValue) {
            // TODO: blacklist

            // allow empty username (prohibited by required) and allow
            // own username
            if (ctrl.$isEmpty(modelValue) ||
                (authService.user &&
                 authService.user.user.username === modelValue)) {
              return $q.when();
            }
            const defer = $q.defer();

            $http.get(config.apiUrl + '/people/username/' + modelValue)
              .success(function(data) {
                defer.reject('The username is already taken.');
              })
              .error(function(data, status) {
                // username available
                if (status === 404) {
                  return defer.resolve();
                }
                defer.reject(
                  'An error occured while checking if the username is available'
                );
              });

            return defer.promise;
          };
        }
      };
    }
  ]);
};
