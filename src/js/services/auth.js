module.exports = function (app) {
  app.factory('authService', ['config', '$http', '$q', '$window',
    function (config, $http, $q, $window) {
      var authService = {
        inProgress: false,
        orcidUrl: config.api_url + '/oauth/orcid?app_callback=' +
          encodeURIComponent(
            $window.location.origin +
            $window.location.pathname +
            '#/oauth/orcid'
          )
      };

      // sign in with a token
      function signinToken (token) {
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
            config.api_url + '/signin',
            null, 
            {
              headers: {'X-Auth-Token': token},
              timeout: 10000
            }
          )
          .success(function (data, status) {
            authService.inProgress = false;

            // store token in session storage
            $window.sessionStorage.token = data.token;

            // set user
            setUser(data.user);

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
      authService.signinToken = signinToken;

      // set user
      function setUser (user) {
        authService.user = user;
        // store token in local storage (if requested by user)
        if (user.settings.remember) {
          $window.localStorage.token = $window.sessionStorage.token;
        } else {
          delete $window.localStorage.token;
        }
      }
      authService.setUser = setUser;

      // sign out and forget token
      function signout () {
        delete $window.sessionStorage.token;
        delete $window.localStorage.token;
        delete $http.defaults.headers['X-Auth-Token'];
        delete authService.user;
      }
      authService.signout = signout;

      // grab token from session or local storage
      var token = $window.sessionStorage.token || $window.localStorage.token;

      // sign in if token is present
      if (token) {
        authService.signinToken(token);
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
