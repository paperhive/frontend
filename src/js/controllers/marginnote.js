module.exports = function (app) {
  app.controller('MarginNoteCtrl', [
    '$scope',
    function($scope) {
      var rangy = require("rangy");
      var highlighter = rangy.createHighlighter();
      highlighter.addClassApplier(rangy.createClassApplier("ph-highlight", {
        ignoreWhiteSpace: true,
        tagNames: ["span", "a"]
      }));

      $scope.rangySelection = null;
      $scope.phHighlightSelection = function() {
        $scope.rangySelection = rangy.getSelection();
        highlighter.highlightSelection("ph-highlight", $scope.rangySelection);
      };

      $scope.phUnhighlightSelection = function() {
        highlighter.unhighlightSelection($scope.rangySelection);
        $scope.rangySelection = null;
      };

    }]);
};
