'use strict';
export default function(app) {
  app.factory('authService', ['config', '$http', '$q', '$rootScope', '$window', '$location',
    function(config, $http, $q, $rootScope, $window, $location) {
      const authService = {
        inProgress: false,
        user: undefined,
        token: undefined,
        loginToken: undefined,
        signout: undefined,
      };

      // authService.returnPath
      function setReturnPath() {
        if ($location.path() !== '/signup' && $location.path() !== '/login') {
          authService.returnPath = $location.path();
        }
        if (!authService.returnPath) {
          authService.returnPath = $location.search().returnPath || '/';
        }
      }
      setReturnPath();
      $rootScope.$on('$locationChangeSuccess', setReturnPath);

      // get returnUrl (includes returnPath)
      authService.getReturnUrl = () => {
        return `${$window.location.origin}${config.baseHref}authReturn?returnPath=${encodeURIComponent(authService.returnPath)}`;
      };

      // get url for initiating an auth dance
      authService.getAuthUrl = (provider) => {
        const returnUrl = authService.getReturnUrl();
        return `${config.apiUrl}/auth/${provider}/initiate?returnUrl=${encodeURIComponent(returnUrl)}`;
      };

      // log in with a token
      function _loginToken(token) {
        return function() {
          return $http.post(
            config.apiUrl + '/auth/token/login',
            null,
            {
              headers: {'Authorization': 'token ' + token},
              timeout: 10000
            }
          );
        };
      }

      // log in with email/username and password
      function _loginEmail(emailOrUsername, password) {
        return function() {
          return $http.post(config.apiUrl + '/auth/email/login', {
            emailOrUsername,
            password,
          });
        };
      }

      // log in wrapper
      function login(loginFun) {
        if (authService.user) {
          return $q.reject('Already logging in.');
        }
        if (authService.inProgress) {
          return $q.reject('Already logging in.');
        }
        const deferred = $q.defer();
        authService.inProgress = true;
        const loginPromise = loginFun();
        loginPromise
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
            deferred.reject(data);
          });

        return deferred.promise;
      }
      authService.loginToken = (token) => {
        return login(_loginToken(token));
      };
      authService.loginEmail = (emailOrUsername, password) => {
        return login(_loginEmail(emailOrUsername, password));
      };

      authService.signupEmail = (email, password, returnUrl) => {
        return $http.post(
          config.apiUrl + '/auth/email/initiate',
          {email, password, returnUrl}
        );
      };

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
        delete $http.defaults.headers['Authorization'];
        delete authService.user;
        delete authService.token;
      }
      authService.signout = signout;

      // grab token from session or local storage
      const token = $window.sessionStorage.token || $window.localStorage.token;

      // sign in if token is present
      if (token) {
        authService.loginToken(token);
      }

      return authService;
    }
  ]);
};
