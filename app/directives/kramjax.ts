/*global MathJax*/
'use strict';

// TODO: ts complains about missing default export but this works!
import jquery from 'jquery';
import kramed from 'kramed';
import {highlightAuto} from 'highlightjs';
// TODO: const MathJax = require('MathJax');

export default function(app) {

  // syntax highlighting with highlight.js
  kramed.setOptions({
    highlight: function(code) {
      return highlightAuto(code).value;
    }
  });

  app.directive(
    'kramjax', ['$sanitize', 'notificationService',
    function($sanitize, notificationService) {
      // modify the kramed renderer such that math items are wrapped in
      // div and span groups
      const renderer = new kramed.Renderer();
      const origMathRenderer = renderer.math;

      renderer.math = function(content, language, display) {
        if (display) {
          return '<div class="mathjax">' + content + '</div>';
        } else {
          return '<span class="mathjax">' + content + '</span>';
        }
      };

      renderer.link = (href, title, text) => {
        let out = `<a href="${href}"`;

        // add target="_blank" if href is not to paperhive
        if (!/^(https?:\/\/)?[^\/]*paperhive\.org/.test(href)) {
          out += ` target="_blank"`;
        }

        // add title if given
        if (title) out += ` title="${title}"`;

        // complete link with text
        out += `>${text}</a>`;
        return out;
      };

      return {
        restrict: 'E',
        scope: {body: '='},
        link: function(scope, element, attrs) {
          scope.$watch('body', function(newValue) {
            try {
              element.html(
                  $sanitize(kramed(newValue || '', {renderer: renderer}))
              );
              // replace span/div tags with script tags
              jquery(element[0]).find('.mathjax').each(function(index, el) {
                jquery(el).replaceWith(origMathRenderer(
                    jquery(el).text(), 'math/tex', jquery(el).prop('tagName') === 'DIV'
                ));
              });
              MathJax.Hub.Queue(['Typeset', MathJax.Hub, element[0]], [function() {
                scope.$emit('FinishedMathJax');
              }] );
            } catch (e) {
              notificationService.notifications.push({
                type: 'error',
                message: e.message
              });
            }
          });
        }
      };
    }
  ]);
};
