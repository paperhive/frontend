'use strict';
import { dedent } from 'dentist';

import template from './helpMarkdown.html';

export default function(app) {
  app.component('helpMarkdown', {
    template,
    controller: [
      function() {
        const ctrl = this;

        ctrl.toc = [];

        ctrl.paragraph = dedent(`
          Paragraphs are separated by a blank line.

          This is another paragraph.
        `);

        ctrl.fontStyle = dedent(`
          It's very easy to make some words *italic* and other words **bold**.
          Any word wrapped with two tildes (like ~~this~~) will appear crossed out.
        `);

        ctrl.link = dedent(`
          You can even link to [PaperHive](https://paperhive.org/).
        `);

        ctrl.headers = dedent(`
          You can structure your texts in the following way:

          # Title
          ## Subtitle
          ### Another deeper title

          You can use one \`#\` all the way up to \`######\` six for different title sizes.
        `);

        ctrl.lists = dedent(`
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
        `);

        ctrl.separator = dedent(`
          A horizontal line looks like this:

          ---
          This is text.
        `);

        ctrl.quote = dedent(`
          If you'd like to quote someone, use the > character before the line:

          > This is a blockquote.
          >
          > This is the second paragraph.
        `);

        ctrl.image = dedent(`
          If you want to insert images, this is how you do it:

          ![Image of Einstein](https://upload.wikimedia.org/wikipedia/commons/6/6f/Einstein-formal_portrait-35.jpg)
        `);

        ctrl.code = dedent(`
          If you have inline code blocks, you can wrap them in backticks: \`var example = true\`.

          If you've got a longer block of code, you can use \`\`\`:

          \`\`\`
          if (isAwesome){
            return true
          }
          \`\`\`
        `);

        ctrl.formulas = dedent(`
          You can use $$\\LaTeX$$ to typeset formulas. A formula can be displayed inline, e.g. $$e=mc^2$$, or as a block:
          $$\\int_\\Omega \\nabla u \\cdot \\nabla v~dx = \\int_\\Omega fv~dx$$
          Also check out this [LaTeX introduction](https://en.wikibooks.org/wiki/LaTeX/Mathematics).
        `);

      }
    ]
  });
};
