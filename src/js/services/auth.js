module.exports = function (app) {
  app.factory('AuthService', ['config', '$http', '$q',
    function (config, $http, $q) {
      var authService = {
        inProgress: false,
        orcidUrl: config.api_url + '/oauth/orcid'
      };

      authService.signinOrcid = function (code, state) {
        var deferred = $q.defer();
        if (authService.inProgress) {
          return deferred.reject('Already signing in.');
        }
        if (authService.user) {
          return deferred.reject('Already signed in.');
        }
        authService.inProgress = true;
        $http
          .post(
            config.api_url + '/oauth/orcid/login',
            {code: code, state: state},
            {timeout: 10000}
          )
          .success(function (data, status) {
            authService.inProgress = false;
            authService.user = data;
            deferred.resolve(data);
          })
          .error(function (data) {
            authService.inProgress = false;
            deferred.reject('signing in failed');
          });

        return deferred.promise;
      };

      return authService;
    }
  ]);
};
