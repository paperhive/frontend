module.exports = function (app) {
  app.factory('NotificationsService', [
    function () {
      return {
        notifications: []
      };
    }
  ]);
};
