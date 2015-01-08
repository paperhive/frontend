module.exports = function (app) {
  app.directive('annotatable', [function () {
    return {
      restrict: 'A',
      scope: {
         place: "@"
      },
      link: function (scope, element, attrs) {
        element.on('mouseup', function(event) {
          console.log(0);
          console.log(scope.place);
          var annotationPlace = scope.getElementById(scope.place);
          console.log(annotationPlace);
          // Get selected text, cf.
          // <http://stackoverflow.com/a/5379408/353337>.
          var text = "";
          if (window.getSelection) {
            text = window.getSelection().toString();
          } else if (document.selection && document.selection.type != "Control") {
            text = document.selection.createRange().text;
          }
          if (text !== "") {
            // create an annotation box
            console.log("text marked");
          }
        });
      }
    };
  }]);
};
