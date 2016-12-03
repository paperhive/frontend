export default function(app) {
  // see https://docs.angularjs.org/guide/forms
  app.directive('validateDocumentSource', [
    '$q', '$http', 'config',
    function($q, $http, config) {
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
          validateDocumentSource: '=',
        },
        link: function(scope, elm, attrs, ctrl) {
          // allows to cancel pending requests
          let canceler;

          ctrl.$asyncValidators.documentSource =
            function(modelValue, viewValue) {
              scope.validateDocumentSource = undefined;

              if (canceler) {
                canceler.resolve();
                canceler = undefined;
              }

              // allow empty document source (prohibited by required)
              if (ctrl.$isEmpty(modelValue)) {
                return $q.when();
              }

              canceler = $q.defer();
              const defer = $q.defer();
              $http.get(config.apiUrl + '/documents/sources', {
                params: {handle: modelValue},
                timeout: canceler.promise,
              })
              .success(function(data) {
                scope.validateDocumentSource = data;
                defer.resolve();
              })
              .error(function(data, status) {
                scope.validateDocumentSource = undefined;
                if (status === 404) {
                  defer.reject('Document source is not recognized');
                }
                defer.reject(
                  'An error occured while checking the document source',
                );
              });
              return defer.promise;
            };
        },
      };
    },
  ]);
};
