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

          Any word wrapped with two tildes (like ~~this~~) will appear crossed out.
          `).trim();

        $scope.lists = stripIndent(`
          Sometimes you want numbered lists:

          1. One
          2. Two
          3. Three

          ***

          Sometimes you want bullet points:

          * Start a line with a star
          * Profit!
          `).trim();

        $scope.image = "If you want to embed images, this is how you do it: ![Image of Einstein](https://upload.wikimedia.org/wikipedia/commons/6/6f/Einstein-formal_portrait-35.jpg)";

        $scope.headers = stripIndent(`
          # Structured documents
          Sometimes it's useful to have different levels of headings to structure your documents. Start lines with a \`#\` to create headings. Multiple \`##\` in a row denote smaller heading sizes.

          ### This is a third-tier heading

          You can use one \`#\` all the way up to \`######\` six for different heading sizes.

          If you'd like to quote someone, use the > character before the line:

          > This is a blockquote.
          >     on multiple lines
          that may be lazy.
          >
          > This is the second paragraph.
        `).trim();

        $scope.code = stripIndent(`
          There are many different ways to style code with markdown. If you have inline code blocks, wrap them in backticks: \`var example = true\`.  If you've got a longer block of code, you can indent with four spaces:

              if (isAwesome){
                 return true
              }

          PaperHive also supports something called code fencing, which allows for multiple lines without indentation:

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
