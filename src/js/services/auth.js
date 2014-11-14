module.exports = function (app) {
  app.factory('AuthService', ['config', '$http', function (config, $http) {
    var authService = {};

    authService.loginOrcid = function (code, state) {
      // TODO
    };

    return authService;
  }]);
};
