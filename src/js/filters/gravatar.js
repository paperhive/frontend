module.exports = function (app) {
  app.filter('gravatarUrl', function () {
    return function (input) {
      return "https://secure.gravatar.com/avatar/" + input.gravatarMd5 +
        "?s=" + input.size +
        "&d=identicon";
    };
  });
};
