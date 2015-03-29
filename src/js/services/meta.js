'use strict';
module.exports = function(app) {
  app.factory(
    'metaService',
    [
      function() {
        var data = {
          title: undefined,
          author: undefined,
          description: undefined,
          keywords: undefined
        };

        return data;
      }
    ]);
};
