module.exports = function (app) {
  app.factory('AuthService', ['config', '$http', '$q', '$window',
    function (config, $http, $q, $window) {
      var authService = {
        inProgress: false,
        orcidUrl: config.api_url + '/oauth/orcid'
      };

      function signin(url, data, config) {
        var deferred = $q.defer();
        if (authService.inProgress) {
          return deferred.reject('Already signing in.');
        }
        if (authService.user) {
          return deferred.reject('Already signed in.');
        }
        authService.inProgress = true;
        $http
          .post(url, data, config)
          .success(function (data, status) {
            authService.inProgress = false;
            authService.user = data.user;

            // save token
            $window.sessionStorage.token = data.token;
            if (data.user.settings.remember) {
              $window.localStorage.token = data.token;
            }

            // use token for all subsequent HTTP requests to API
            $http.defaults.headers.common['X-Auth-Token'] = data.token;

            deferred.resolve(data);
          })
          .error(function (data) {
            authService.inProgress = false;
            signout();
            deferred.reject('signing in failed');
          });

        return deferred.promise;
      }

      function signout() {
        delete $window.sessionStorage.token;
        delete $window.localStorage.token;
        delete $http.defaults.headers['X-Auth-Token'];
        delete authService.user;
      }

      // grab token from session or local storage
      var token = $window.sessionStorage.token || $window.localStorage.token;

      // sign in if token is present
      if (token) {
        signin(
          config.api_url + '/signin',
          null,
          {
            headers: {'X-Auth-Token': token},
            timeout: 10000
          }
        );
      }

      // sign in function for ORCID viaOAuth
      authService.signinOrcid = function (code, state) {
        return signin(
          config.api_url + '/oauth/orcid/signin',
          {code: code, state: state},
          {timeout: 10000}
        );
      };

      return authService;
    }
  ]);
};
