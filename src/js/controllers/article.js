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
    '$scope', '$route', '$routeSegment', '$document', '$http', 'config',
    'authService', 'NotificationsService',
    function($scope, $route, $routeSegment, $document, $http, config,
             authService, notificationsService) {

      // fetch article
      $http.get(config.api_url + '/articles/' + $routeSegment.$routeParams.id)
        .success(function (article) {
          $scope.article = article;
        })
        .error(function (data) {
          notificationsService.notifications.push({
            type: 'error',
            message: data.message ? data.message : 'could not fetch article ' +
              '(unknown reason)'
          });
        });

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

      $scope.latestRangySelection = undefined;
      $scope.latestRangySelectionSerialized = undefined;
      $scope.phHighlightSelection = function() {
        //// Unhighlight previous selection
        //highlighter.unhighlightSelection($scope.latestRangySelection);
        if ($scope.latestRangySelection === undefined) {
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
        }
      };

      $scope.phPurgeSelection = function() {
        if ($scope.latestRangySelection) {
          highlighter.unhighlightSelection($scope.latestRangySelection);
          $scope.latestRangySelection = undefined;
        }
        $scope.verticalOffsetSelection = undefined;
      };

      $scope.newAnnotation = {};

      $scope.phGetSelection = function() {
        // Intercept mouseup event to display new annotation box
        // Get selected text, cf.
        // <http://stackoverflow.com/a/5379408/353337>.
        var text = "";
        if (window.getSelection) {
          text = window.getSelection().toString();
        } else if (document.selection && document.selection.type != "Control") {
          text = document.selection.createRange().text;
        }

        if (!!text) {
          // Get vertical offset of the current selection.
          if (window.getSelection) {
            selection = window.getSelection();
            // Collect all offsets until we are at the same level as the
            // element in which the annotations are actually displayed (the
            // annotation column). This is ugly since it makes assumptions
            // about the DOM tree.
            // TODO revise
            var totalOffset = 0;
            if (selection) {
              if (selection.anchorNode) {
                if (selection.anchorNode.parentElement) {
                  totalOffset += selection.anchorNode.parentElement.offsetTop;
                  if (selection.anchorNode.parentElement.parentElement) {
                    totalOffset += selection.anchorNode.parentElement.parentElement.offsetTop;
                    if (selection.anchorNode.parentElement.parentElement.parentElement) {
                      totalOffset += selection.anchorNode.parentElement.parentElement.parentElement.offsetTop;
                    }
                  }
                }
              }
            }
            $scope.verticalOffsetSelection = totalOffset + "px";
            // Unhighlight previous selection.
            if ($scope.latestRangySelection) {
              highlighter.unhighlightSelection($scope.latestRangySelection);
              $scope.latestRangySelection = undefined;
            }
            // TODO ATTENTION! The selection is of type "None" after rangy
            // messed around.
          } else if (document.selection &&
                     document.selection.type != "Control") {
            $scope.verticalOffsetSelection =
              document.selection.createRange() + "px";
          }
        }
      };

    }]);
};
