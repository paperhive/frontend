'use strict';

module.exports = function(app) {
  app.controller('SideNavCtrl', ['$anchorScroll', '$location', '$scope',
    function($anchorScroll, $location, $scope) {
      $scope.gotoAnchor = function(anchorLinkName) {
        $anchorScroll.yOffset = 98;
        var newHash = anchorLinkName;
        $location.hash(anchorLinkName);
        $anchorScroll();
      };
    }
  ]);
};
