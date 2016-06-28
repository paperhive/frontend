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

        ctrl.toc = [];

        $scope.text = stripIndent(`
          Paragraphs are separated by a blank line.

          It's very easy to make some words *italic* and other words **bold**.
          Any word wrapped with two tildes (like ~~this~~) will appear crossed out.

          A horizontal line looks like this:

          ---
          You can even link to [PaperHive](https://paperhive.org/).

        `).trim();

        $scope.lists = stripIndent(`
          Bullet list:
          * Start a line with a star
          * Food
            * Fruits
              * Oranges
              * Apples

          ***

          Numbered list:
          1. One
          2. Two
          3. Three
        `).trim();

        $scope.image = stripIndent(`
          If you want to embed images, this is how you do it:

          ![Image of Einstein](https://upload.wikimedia.org/wikipedia/commons/6/6f/Einstein-formal_portrait-35.jpg)
        `).trim();

        $scope.headers = stripIndent(`
          You can structure your texts in the following way:

          # Title
          ## Subtitle
          ### Another deeper title

          You can use one \`#\` all the way up to \`######\` six for different title sizes.

          If you'd like to quote someone, use the > character before the line:

          > This is a blockquote.
          >
          > This is the second paragraph.
        `).trim();

        $scope.code = stripIndent(`
          If you have inline code blocks, you can wrap them in backticks: \`var example = true\`.  If you've got a longer block of code, you can indent with four spaces:

              if (isAwesome){
                 return true
              }

          Or you can write multiple lines without indentation by using \`\`\`:

          \`\`\`
          if (isAwesome){
            return true
          }
          \`\`\`
        `).trim();

      }
    ]
  });
};
