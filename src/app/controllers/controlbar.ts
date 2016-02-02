'use strict';
export default function(app) {

  app.controller(
    'ControlbarCtrl', [
      '$routeSegment',
      function($routeSegment) {
        // this.tab = 1;

        // this.isSet = function(checkTab) {
        //   return this.tab === checkTab;
        // };

        // this.setTab = function(activeTab) {
        //   this.tab = activeTab;
        // };
      }
    ]);
};
