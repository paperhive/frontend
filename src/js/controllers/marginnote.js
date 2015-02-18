module.exports = function (app) {
  app.controller('MarginNoteCtrl', [
    '$scope', '$window',
    function($scope, $window) {
      $scope.offsetPx = undefined;
      $scope.text = undefined;

      var rangy = require("rangy");
      var highlighter = rangy.createHighlighter();
      highlighter.addClassApplier(rangy.createClassApplier("ph-highlight", {
        ignoreWhiteSpace: true,
        tagNames: ["span", "a"]
      }));

      var userSelection;
      $scope.phHighlightSelection = function() {
        userSelection = $window.getSelection().getRangeAt(0);
        highlighter.highlightSelection("ph-highlight", $scope.userSelection);
      };

      $scope.phUnhighlightSelection = function() {
        highlighter.unhighlightSelection(userSelection);
      };
    }]);
};
