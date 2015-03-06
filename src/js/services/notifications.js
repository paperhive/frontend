module.exports = function (app) {
  app.factory('notificationService', [
    function () {
      return {
        notifications: []
      };
    }
  ]);
};
