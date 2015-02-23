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
  textSelection: undefined,
  replies: [
    annotations[1],
    annotations[2]
  ]
};
// END DEBUG

module.exports = function (app) {
  app.controller('ArticleCtrl', [
    '$scope', '$route', '$routeSegment', 'config',
    'authService', 'NotificationsService',
    function($scope, $route, $routeSegment, config,
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

      var number = 0;
      $scope.addDiscussion = function(title, body, textSelection) {

        // We always needs a title.
        // This conditional applies for short inline comments
        // on the PDF.
        if (title === undefined) {
          title = body;
          body = undefined;
        }

        number++;
        article.discussions.push(
          {
          _id: "857431",
          title: title,
          number: number,
          textSelection: textSelection,
          originalAnnotation: {
            _id: "1242340",
            author: $scope.auth.user,
            body: body,
            time: new Date(),
            editTime: undefined,
            labels: [],
            permissions: {
              read: true,
              edit: true,
              delete: true
            },
          },
          replies: []
        });
      };
    }]);
};
