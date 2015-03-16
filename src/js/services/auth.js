'use strict';
module.exports = function(app) {
  app.factory('authService', ['config', '$http', '$q', '$rootScope', '$window',
    function(config, $http, $q, $rootScope, $window) {
      var authService = {
        inProgress: false,
        orcidUrl: config.apiUrl + '/oauth/orcid?app_callback=' +
          encodeURIComponent(
            $window.location.origin +
            $window.location.pathname +
            '#/oauth/orcid'
          )
      };

      // sign in with a token
      function signinToken(token) {
        if (authService.user) {
          return $q.reject('Already signed in.');
        }
        if (authService.inProgress) {
          return $q.reject('Already signing in.');
        }
        var deferred = $q.defer();
        authService.inProgress = true;
        $http
          .post(
            config.apiUrl + '/signin',
            null,
            {
              headers: {'X-Auth-Token': token},
              timeout: 10000
            }
          )
          .success(function(data, status) {
            authService.inProgress = false;
            authService.user = data.user;
            authService.token = token;

            // store token in session storage
            $window.sessionStorage.token = data.token;

            // use token for all subsequent HTTP requests to API
            $http.defaults.headers.common['X-Auth-Token'] = data.token;

            deferred.resolve(data);
          })
          .error(function(data) {
            authService.inProgress = false;
            signout();
            deferred.reject('signing in failed');
          });

        return deferred.promise;
      }
      authService.signinToken = signinToken;

      // store/remove token in local storage (if requested by user)
      $rootScope.$watch(function() {
        return authService.user && authService.user.settings &&
            authService.user.settings.remember && authService.token;
      }, function(token) {
        if (token) {
          $window.localStorage.token = token;
        } else {
          delete $window.localStorage.token;
        }
      }, true);

      // sign out and forget token
      function signout() {
        delete $window.sessionStorage.token;
        delete $window.localStorage.token;
        delete $http.defaults.headers['X-Auth-Token'];
        delete authService.user;
        delete authService.token;
      }
      authService.signout = signout;

      // grab token from session or local storage
      var token = $window.sessionStorage.token || $window.localStorage.token;

      // sign in if token is present
      if (token) {
        authService.signinToken(token);
      }

      return authService;
    }
  ]);
};
