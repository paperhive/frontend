

module.exports = function (app) {
  app.controller('SideNavCtrl', ['$anchorScroll', '$location', '$scope',
    function ($anchorScroll, $location, $scope) {
      $scope.gotoAnchor = function(anchorLinkName) {
        $anchorScroll.yOffset = 100;   // always scroll by 50 extra pixels
        var newHash = anchorLinkName;
        $location.hash(anchorLinkName);
        $anchorScroll();
      };
    }
  ]);
};
