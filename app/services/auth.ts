'use strict';
export default function(app) {
  app.factory('authService', ['config', '$http', '$q', '$rootScope', '$window', '$location',
    function(config, $http, $q, $rootScope, $window, $location) {
      const authService = {
        loginPromise: undefined,
        user: undefined,
        token: undefined,
        loginToken: undefined,
        logout: undefined,
      };

      // authService.returnPath
      function setReturnPath() {
        if (['/login', '/password/request', '/password/reset', '/signup'].indexOf($location.path()) === -1) {
          authService.returnPath = $location.url();
        }
        if (!authService.returnPath) {
          authService.returnPath = $location.search().returnPath || '/';
        }
      }
      setReturnPath();
      $rootScope.$on('$locationChangeSuccess', setReturnPath);

      const frontendUrl = authService.frontendUrl = `${$window.location.origin}${config.baseHref}`;

      // get url for initiating an auth dance
      authService.getAuthUrl = (provider) => {
        return `${config.apiUrl}/auth/${provider}/initiate?frontendUrl=${encodeURIComponent(frontendUrl)}&returnUrl=${encodeURIComponent(authService.returnPath)}`;
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
          return $http.post(config.apiUrl + '/auth/emailLogin', {
            emailOrUsername,
            password,
          });
        };
      }

      // log in wrapper
      function login(loginFun) {
        const deferred = $q.defer();

        // if already logging in: wait until completed
        if (authService.loginPromise) {
          authService.loginPromise.then(
            data => {
              login(loginFun).then(deferred.resolve, deferred.reject);
            },
            deferred.reject
          );
          return deferred.promise;
        }

        // set loginPromise
        authService.loginPromise = deferred.promise;

        // log in
        loginFun()
          .success(function(data, status) {
            authService.loginPromise = undefined;
            authService.user = data.person;
            authService.token = data.token;

            // fires 'storage' event in other tabs
            $window.localStorage.token = data.token;

            // use token for all subsequent HTTP requests to API
            $http.defaults.headers.common['Authorization'] = 'token ' + data.token;

            deferred.resolve(data);
          })
          .error(function(data) {
            authService.loginPromise = undefined;
            authService.logout();
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

      authService.signupEmail = (email, password) => {
        return $http.post(
          config.apiUrl + '/auth/emailSignup/initiate',
          {email, password, frontendUrl, returnUrl: authService.returnPath}
        );
      };

      authService.signupEmailConfirm = (token) => {
        return login(() => {
          return $http.post(config.apiUrl + '/auth/emailSignup/confirm', {token});
        });
      };

      authService.passwordReset = (token, password) => {
        return login(() => {
          return $http.post(`${config.apiUrl}/auth/passwordReset/confirm`, {token, password});
        });
      };

      authService.oauthInitiate = (provider) => {
        return $http.get(config.apiUrl + '/auth/' + provider + '/initiate', {
          params: {
            frontendUrl,
            returnUrl: authService.returnPath,
            redirect: false,
          },
        }).then(
          response => { $window.location.href = response.data.location; },
          response => response.data
        );
      };

      authService.oauthConfirm = (provider, code, state) => {
        return login(() => {
          return $http.post(config.apiUrl + '/auth/' + provider + '/confirm', {code, state});
        });
      };

      // sign out and forget token
      authService.logout = function() {
        delete $window.localStorage.token;
        delete $http.defaults.headers['Authorization'];
        delete authService.user;
        delete authService.token;
      };

      authService.passwordRequest = (emailOrUsername) =>
        $http.post(`${config.apiUrl}/auth/passwordReset/initiate`, {
          emailOrUsername, frontendUrl, returnUrl: authService.returnPath,
        });

      // sync token from local storage to authService
      $window.addEventListener('storage', (event) => {
        // we're only interested in a token
        if (event.key !== 'token') return;

        if (!authService.token && event.newValue) {
          // we don't have a token but got one from local storage
          authService.loginToken(event.newValue);
        } else if (authService.token && !event.newValue) {
          // we have a token but the token has been removed from local storage
          authService.logout();
        }
        $rootScope.$apply();
      });

      // set token from local storage when initializing (if available)
      if ($window.localStorage.token) {
        authService.loginToken($window.localStorage.token);
      }

      return authService;
    }
  ]);
};
