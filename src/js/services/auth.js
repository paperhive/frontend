module.exports = function (app) {
  app.factory('AuthService', ['config', '$http', '$q',
    function (config, $http, $q) {
      var authService = {};

      authService.signinOrcid = function (code, state) {
        var deferred = $q.defer();
        if (authService.user) {
          deferred.reject('Already logged in.');
        }
        $http
          .post(
            config.api_url + '/oauth/orcid/login',
            {code: code, state: state},
            {timeout: 10000}
          )
          .success(function (data, status) {
            authService.user = data;
            deferred.resolve(data);
          })
          .error(function (data) {
            deferred.reject('signing in failed');
          });

        return deferred.promise;
      };

      return authService;
    }
  ]);
};
