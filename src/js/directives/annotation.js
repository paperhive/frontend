module.exports = function (app) {

  app.directive('annotation', function() {
    return {
      restrict: 'E',
      require: ['isArticleAuthor', 'canDelete'],
      scope: {
        annotation: '=content',
        // For some reason, we can't use one-directional ('@') binding here,
        // cf. <http://stackoverflow.com/a/18016206/353337>.
        isArticleAuthor: "=",
        canDelete: "="
      },
      templateUrl: 'templates/comment.html'
    };
  });
};
