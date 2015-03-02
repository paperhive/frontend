module.exports = function (app) {
  // see https://docs.angularjs.org/guide/forms
  app.directive('validateArticleSource', [
    '$q', '$http', 'config',
    function ($q, $http, config) {
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
          validateArticleSource: '='
        },
        link: function (scope, elm, attrs, ctrl) {
          ctrl.$asyncValidators.articleSource = function (modelValue, viewValue) {
            scope.validateArticleSource = undefined;

            // allow empty article source (prohibited by required)
            if (ctrl.$isEmpty(modelValue)) return $q.when();

            var defer = $q.defer();
            $http.get(config.api_url + '/articles/sources', {
              params: {handle: modelValue}
            })
              .success(function (data) {
                scope.validateArticleSource = data;
                defer.resolve();
              })
              .error(function (data, status) {
                if (status === 404) {
                  defer.reject('Article source is not recognized');
                }
                defer.reject('An error occured while checking the article' +
                             'source');
              });
            return defer.promise;
          };
        }
      };
    }
  ]);
};
