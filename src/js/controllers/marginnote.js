module.exports = function (app) {
  app.controller('MarginNoteCtrl', [
    '$scope',
    function($scope) {
      $scope.offsetPx = undefined;
      $scope.text = undefined;

      $scope.focus = false;
      $scope.phHighlightSelection = function() {
        $scope.focus = true;
        //highlightSelection();
        var userSelection = window.getSelection().getRangeAt(0);
        var rangy = require("rangy");
        var highlighter = rangy.createHighlighter();
        highlighter.addClassApplier(rangy.createClassApplier("ph-highlight", {
          ignoreWhiteSpace: true,
          tagNames: ["span", "a"]
        }));
        highlighter.highlightSelection("ph-highlight", userSelection);
      };
      $scope.unHighlightSelection = function() {
        $scope.focus = false;
      };
    }]);
};
