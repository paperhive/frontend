/*global MathJax*/
'use strict';

const kramed = require('kramed');
const $ = require('jquery');
// TODO: const MathJax = require('MathJax');

module.exports = function(app) {

  // syntax highlighting with highlight.js
  kramed.setOptions({
    highlight: function(code) {
      return require('highlightjs').highlightAuto(code).value;
    }
  });

  app.directive(
    'kramjax', ['$sanitize', 'notificationService',
    function($sanitize, notificationService) {
      // modify the kramed renderer such that math items are wrapped in
      // div and span groups
      const renderer = new kramed.Renderer();
      const origRenderer = renderer.math;
      renderer.math = function(content, language, display) {
        if (display) {
          return '<div class="mathjax">' + content + '</div>';
        } else {
          return '<span class="mathjax">' + content + '</span>';
        }
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
              $(element[0]).find('.mathjax').each(function(index, el) {
                $(el).replaceWith(origRenderer(
                  $(el).text(), 'math/tex', $(el).prop('tagName') === 'DIV'
                ));
              });
              MathJax.Hub.Queue(['Typeset', MathJax.Hub, element[0]]);
            } catch (e) {
              notificationService.notifications.push({
                type: 'error',
                message: e
              });
            }
          });
        }
      };
    }
  ]);
};
