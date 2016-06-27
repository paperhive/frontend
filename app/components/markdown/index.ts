'use strict';

import template from './template.html';

export default function(app) {
  app.component('markdown', {
    template,
    controller: [
      '$scope',
      function($scope) {
        const ctrl = this;

        $scope.text = "It's very easy to make some words **bold** and other words *italic* with Markdown. You can even [link to Google!](http://google.com)";

        $scope.lists = "Sometimes you want numbered lists:";

        $scope.image = "If you want to embed images, this is how you do it: ![Image of Yaktocat](https://octodex.github.com/images/yaktocat.png)";

      }
    ]
  });
};
