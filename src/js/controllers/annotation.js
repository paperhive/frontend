// DEBUG
var discussion = {
  _id: "857431",
  title: "Title of the annotation",
  number: 22,
  originalAnnotationId: "1242340",
  replyIds: [
    "1242341",
    "1242342"
    ]
};

var allAnnotations = [
  {
  _id: "1242340",
  authorId: "ea5411",
  body: "Simple equations, like $$x^y$$ or $$x_n = \\sqrt{a + b}$$ can be typeset Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. ```python def mysin(x): y = sin(x) return y ```"
  },
  {
  _id: "1242341",
  authorId: "152ea4",
  body: "Bringt doch alles nichts"
  },
  {
  _id: "1242342",
  authorId: "ea5411",
  body: "I like turtles"
  }
];

var annoLookup = {};
for (var i = 0, len = allAnnotations.length; i < len; i++) {
  annoLookup[allAnnotations[i]._id] = allAnnotations[i];
}
// END DEBUG

module.exports = function (app) {
  app.controller('AnnotationCtrl', [
    '$scope', 'AuthService',
    function($scope, AuthService) {
    $scope.discussion = discussion;
    $scope.annoLookup = annoLookup;
    $scope.auth = AuthService;
    this.annoLookup = annoLookup;

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

    this.addAnnotation = function(annotation) {
      return;
    };

    $scope.getUsername = function() {
      return getUserById(annoLookup[discussion.originalAnnotationId].authorId).userName;
    };

    $scope.getOne = function() {
      return "1";
    };

    this.getAnnotation = function(id) {
      return this.annoLookup[id];
    };

    $scope.allAnnotations = allAnnotations;
  }]);
};
