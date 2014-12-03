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

var annotations = [
  {
  _id: "1242340",
  author: users[0],
  body: "Simple equations, like $$x^y$$ or $$x_n = \\sqrt{a + b}$$ can be typeset Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. ```python def mysin(x): y = sin(x) return y ```",
  time: new Date(),
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
  replies: [
    annotations[1],
    annotations[2]
  ]
};

var articles = [
  {
  _id: "0af5e13",
  url: "http://arxiv.org/pdf/1208.0264v3.pdf",
  title: "Preconditioned Recycling Krylov Subspace Methods for Self-Adjoint Problems",
  authors: [users[2], users[1]],
  discussions: [discussion]
}
];
// END DEBUG

module.exports = function (app) {
  app.controller('AnnotationCtrl', [
    '$scope', 'AuthService',
    function($scope, AuthService) {
      $scope.discussion = discussion;
      $scope.articles = articles;
      $scope.auth = AuthService;
      $scope.annotationBody = null;

      console.log(AuthService);

      $scope.subscribers = [
      ];
      // '54789c34049715a67d7915d8'
      if('user' in AuthService) {
        $scope.isSubscribed = $scope.subscribers.indexOf(AuthService.user._id) > -1;
      } else {
        $scope.isSubscribed = false;
      }
      $scope.toggleSubscribe = function() {
        var k = $scope.subscribers.indexOf(AuthService.user._id);
        if (k > -1) {
          // remove from to subscribers list
          $scope.subscribers.splice(k, 1);
          $scope.isSubscribed = false;
        } else {
          // add to subscribers list
          $scope.subscribers.push(AuthService.user._id);
          $scope.isSubscribed = true;
        }
      };

      $scope.addReply = function() {
        if (!$scope.auth.user) {
            throw PhError("Not logged in?");
        }
        // create the annotation
        reply = {
          _id: Math.random().toString(36).slice(2),
          author: $scope.auth.user,
          body: $scope.annotationBody,
          time: new Date(),
          labels: ["reply"]
        };
        $scope.discussion.replies.push(reply);
        // clear body
        $scope.annotationBody = null;
        return;
      };

      $scope.deleteReply = function(deleteId) {
        // TODO remove reply from database, add the following code into the
        // success handler
        var k = -1;
        for (var i = 0; i < $scope.discussion.replies.length; i++) {
          if ($scope.discussion.replies[i]._id === deleteId) {
            k = i;
            break;
          }
        }
        // TODO use this instead of the 
        //_ = require('underscore');
        //var k = _.indexOf(_.pluck($scope.discussion.replies, '_id'), deleteId);
        if (k < 0) {
          throw PhError("Reply not found.");
        }
        // remove if from the list
        $scope.discussion.replies.splice(k, 1);
      };

    }]);
};
