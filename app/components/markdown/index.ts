'use strict';
import stripIndent from 'strip-indent';

import template from './template.html';

export default function(app) {
  app.component('markdown', {
    template,
    controller: [
      function() {
        const ctrl = this;

        ctrl.toc = [];

        ctrl.paragraph = stripIndent(`
          Paragraphs are separated by a blank line.

          This is another paragraph.
        `).trim();

        ctrl.fontStyle = stripIndent(`
          It's very easy to make some words *italic* and other words **bold**.
          Any word wrapped with two tildes (like ~~this~~) will appear crossed out.
        `).trim();

        ctrl.link = stripIndent(`
          You can even link to [PaperHive](https://paperhive.org/).
        `).trim();

        ctrl.headers = stripIndent(`
          You can structure your texts in the following way:

          # Title
          ## Subtitle
          ### Another deeper title

          You can use one \`#\` all the way up to \`######\` six for different title sizes.
        `).trim();

        ctrl.lists = stripIndent(`
          Bullet list:
          * Start a line with an asterisk
          * Food
            * Fruits
              * Oranges
              * Apples

          Numbered list:
          1. One
          2. Two
          3. Three
        `).trim();

        ctrl.separator = stripIndent(`
          A horizontal line looks like this:

          ---
          This is text.
        `).trim();

        ctrl.quote = stripIndent(`
          If you'd like to quote someone, use the > character before the line:

          > This is a blockquote.
          >
          > This is the second paragraph.
        `).trim();

        ctrl.image = stripIndent(`
          If you want to insert images, this is how you do it:

          ![Image of Einstein](https://upload.wikimedia.org/wikipedia/commons/6/6f/Einstein-formal_portrait-35.jpg)
        `).trim();

        ctrl.code = stripIndent(`
          If you have inline code blocks, you can wrap them in backticks: \`var example = true\`.

          If you've got a longer block of code, you can use \`\`\`:

          \`\`\`
          if (isAwesome){
            return true
          }
          \`\`\`
        `).trim();

        ctrl.formulas = stripIndent(`
          Formulas like $$e=mc^2$$ can be used inline or as a display block when it is on a separate line:
          \$\$\\int_\\Omega \\nabla u \\cdot \\nabla v~dx = \\int_\\Omega fv~dx\$\$
        `).trim();

      }
    ]
  });
};
