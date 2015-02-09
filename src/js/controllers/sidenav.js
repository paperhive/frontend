
module.exports = function (app) {
  app.controller('sideNavAnchorScrollCtrl', ['$anchorScroll', '$location', '$scope',
    function ($anchorScroll, $location, $scope) {
      $scope.gotoAnchor = function( anchorLinkName ) {
        var newHash = anchorLinkName;
        if ($location.hash() !== newHash) {
          // set the $location.hash to `newHash` and
          // $anchorScroll will automatically scroll to it
          $location.hash( anchorLinkName );
        } else {
          // call $anchorScroll() explicitly,
          // since $location.hash hasn't changed
          $anchorScroll();
        }
      };
    }
  ]);
};
