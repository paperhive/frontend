'use strict';
export default function(app) {
  app.factory('authService', ['config', '$http', '$q', '$rootScope', '$window',
    function(config, $http, $q, $rootScope, $window) {
      const authService = {
        inProgress: false,
        user: undefined,
        token: undefined,
        signinToken: undefined,
        signout: undefined,
      };
      authService.getAuthUrl = (provider, returnPath) => {
        const returnUrl = authService.getReturnUrl(returnPath);
        return `${config.apiUrl}/auth/${provider}/initiate?returnUrl=${encodeURIComponent(returnUrl)}`;
      };
      authService.getReturnUrl = (returnPath) => {
        return `${$window.location.origin}${config.baseHref}authReturn?returnPath=${encodeURIComponent(returnPath)}`;
      };

      // sign in with a token
      function signinToken(token) {
        if (authService.user) {
          return $q.reject('Already signed in.');
        }
        if (authService.inProgress) {
          return $q.reject('Already signing in.');
        }
        const deferred = $q.defer();
        authService.inProgress = true;
        $http
        .post(
          config.apiUrl + '/auth/signin',
          null,
          {
            headers: {'Authorization': 'token ' + token},
            timeout: 10000
          }
        )
        .success(function(data, status) {
          authService.inProgress = false;
          authService.user = data.person;
          authService.token = token;

          // store token in session storage
          $window.sessionStorage.token = data.token;

          // use token for all subsequent HTTP requests to API
          $http.defaults.headers.common['Authorization'] = 'token ' + data.token;

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
        return authService.token;
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
      const token = $window.sessionStorage.token || $window.localStorage.token;

      // sign in if token is present
      if (token) {
        authService.signinToken(token);
      }

      return authService;
    }
  ]);
};
