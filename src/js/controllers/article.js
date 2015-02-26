// DEBUG
var users = [
  {
  _id: "08ea4",
  orcidId: "dasdasd0",
  userName: "hondi",
  displayName: "Hondanz",
  gravatarMd5: ""
},
{
  _id: "152ea4",
  orcidId: "dasdasd1",
  userName:  "hoppenstedt",
  displayName: "Opa Hoppenstedt",
  gravatarMd5: ""
},
{
  _id: "ea5411",
  orcidId: "dasdasd2",
  userName: "jimmy",
  displayName: "Jimmy",
  email: "jimmy@best.com",
  gravatarMd5: ""
}
];

var accounts = [
  {
  _id: "ea5411da",
  accountName: "arxiv",
  displayName: "arXiv.org"
}
];

var annotations = [
  {
  _id: "1242340",
  author: users[0],
  body: "Simple equations, like $$x^y$$ or $$x_n = \\sqrt{a + b}$$ can be typeset Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. ```python def mysin(x): y = sin(x) return y ```",
  time: new Date(),
  editTime: undefined,
  labels: ["comment", "link"],
  permissions: {
    read: true,
    edit: true,
    delete: true
  }
},
{
  _id: "1242341",
  author: users[1],
  body: "Bringt doch alles nichts",
  time: new Date(),
  editTime: undefined,
  labels: ["reply"],
  permissions: {
    read: true,
    edit: true,
    delete: true
  }
},
{
  _id: "1242342",
  author: users[2],
  body: "I like turtles",
  time: new Date(),
  editTime: undefined,
  labels: ["reply"],
  permissions: {
    read: true,
    edit: true,
    delete: true
  }
}
];

var discussion = {
  _id: "857431",
  title: "Title of the discussion",
  number: 12,
  originalAnnotation: annotations[0],
  serializedSelection: undefined,
  replies: [
    annotations[1],
    annotations[2]
  ]
};
// END DEBUG

module.exports = function (app) {
  app.controller('ArticleCtrl', [
    '$scope', '$route', '$routeSegment', '$document', 'config',
    'authService', 'NotificationsService',
    function($scope, $route, $routeSegment, $document, config,
             authService, notificationsService) {

      // DEBUG
      var article =
        {
        _id: "0af5e13",
        owner: accounts[0],
        url: config.api_url + '/proxy?url=' +
          encodeURIComponent('http://arxiv.org/pdf/1208.0264v4.pdf'),
        //_url: "http://win.ua.ac.be/~nschloe/other/pdf_commenting_new.pdf",
        //url: "https://user.d00d3.net/~nschloe/pdf_commenting_new.pdf",
        title: "Preconditioned Recycling Krylov Subspace Methods for Self-Adjoint Problems",
        authors: [users[2], users[1]],
        discussions: [discussion],
      };
      // END DEBUG

      $scope.auth = authService;
      $scope.article = article;
      // Expose the routeSegment to be able to determine the active tab in the
      // template.
      $scope.$routeSegment = $routeSegment;

      var rangy = require("rangy");
      var highlighter = rangy.createHighlighter();
      highlighter.addClassApplier(rangy.createClassApplier("ph-highlight", {
        ignoreWhiteSpace: true,
        tagNames: ["span", "a"]
      }));

      $scope.phHighlightSerializedSelection = function(serializedSelection) {
        if (!serializedSelection) {
          return;
        }
        //if (!serializedSelection) {
        //  notificationsService.notifications.push({
        //    type: 'warning',
        //    message: 'Empty selection object.'
        //  });
        //  return;
        //}
        if (!rangy.canDeserializeSelection(serializedSelection)) {
          notificationsService.notifications.push({
            type: 'error',
            message: 'Cannot unserialize selection object.'
          });
          return;
        }
        highlighter.highlightSelection(
          "ph-highlight",
          rangy.deserializeSelection(serializedSelection)
        );
      };

      $scope.latestRangySelection = null;
      $scope.latestRangySelectionSerialized = null;
      $scope.phHighlightSelection = function() {
        //// Unhighlight previous selection
        //highlighter.unhighlightSelection($scope.latestRangySelection);

        $scope.latestRangySelection = rangy.getSelection();
        highlighter.highlightSelection(
          "ph-highlight",
          $scope.latestRangySelection
        );
        // Already serialize the selection at this point since for some reason
        // ```
        // $scope.latestRangySelectionSerialized.getAllRanges()
        // ```
        // is empty and hence cannot be serialized anymore.
        $scope.latestRangySelectionSerialized =
          rangy.serializeSelection($scope.latestRangySelection);
      };

      $scope.phUnhighlightSelection = function() {
        highlighter.unhighlightSelection($scope.latestRangySelection);
        //$scope.latestRangySelection = null;
      };

      //// On mousedown anywhere in the document, release the highlighted
      //// selection.
      //$document.on('mousedown', function(event) {
      //  console.log(123);
      //  $scope.verticalOffsetHighlighted = undefined;
      //});

    }]);
};
