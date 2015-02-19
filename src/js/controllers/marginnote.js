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

      var rangySelection;
      $scope.phHighlightSelection = function() {
        rangySelection = rangy.getSelection();
        highlighter.highlightSelection("ph-highlight", rangySelection);
      };

      $scope.phUnhighlightSelection = function() {
        highlighter.unhighlightSelection(rangySelection);
      };

    }]);
};
