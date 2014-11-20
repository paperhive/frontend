module.exports = function (app) {
  app.controller('ControlbarCtrl', [function() {
    this.tab = 1;

    this.isSet = function(checkTab) {
      return this.tab === checkTab;
    };

    this.setTab = function(activeTab) {
      console.log("set tab", activeTab);
      this.tab = activeTab;
    };
  }]);
};
