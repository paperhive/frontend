'use strict';
module.exports = function(app) {
  // see https://docs.angularjs.org/guide/forms
  app.directive('validateArticleSource', [
    '$q', '$http', 'config',
    function($q, $http, config) {
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
          validateArticleSource: '='
        },
        link: function(scope, elm, attrs, ctrl) {
          // allows to cancel pending requests
          var canceler;

          ctrl.$asyncValidators.articleSource =
            function(modelValue, viewValue) {
              scope.validateArticleSource = undefined;

              if (canceler) {
                canceler.resolve();
                canceler = undefined;
              }

              // allow empty article source (prohibited by required)
              if (ctrl.$isEmpty(modelValue)) {
                return $q.when();
              }

              canceler = $q.defer();
              var defer = $q.defer();
              $http.get(config.apiUrl + '/articles/sources', {
                params: {handle: modelValue},
                timeout: canceler.promise
              })
              .success(function(data) {
                scope.validateArticleSource = data;
                defer.resolve();
              })
              .error(function(data, status) {
                scope.validateArticleSource = undefined;
                if (status === 404) {
                  defer.reject('Article source is not recognized');
                }
                defer.reject(
                  'An error occured while checking the article source'
                );
              });
              return defer.promise;
            };
        }
      };
    }
  ]);
};
