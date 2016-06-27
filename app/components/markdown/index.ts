'use strict';
import stripIndent from 'strip-indent';

import template from './template.html';

export default function(app) {
  app.component('markdown', {
    template,
    controller: [
      '$scope',
      function($scope) {
        const ctrl = this;

        $scope.text = stripIndent(`
          # Title
          This is a text.
          ## Subtitle
          It's very easy to make some words **bold** and other words *italic* with Markdown. You can even [link to Google!](http://google.com).
          `).trim();

        $scope.lists = stripIndent(`
          Sometimes you want numbered lists:
           * test
          `).trim();

        $scope.image = "If you want to embed images, this is how you do it: ![Image of Yaktocat](https://octodex.github.com/images/yaktocat.png)";

      }
    ]
  });
};
