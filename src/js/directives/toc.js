'use strict';

var _ = require('lodash');
var $ = require('jquery');

module.exports = function(app) {

  app.directive(
    'toc', ['$parse', function($parse) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var parsedToc = $parse(attrs.toc);

          function getToc(elements, parentLevel) {
            if (elements === undefined) {
              elements = element.find('[id]').filter(function(index, el) {
                return parseInt($(el).attr('toc-level'));
              }).toArray();
              parentLevel = Number.NEGATIVE_INFINITY;
            }
            if (!elements.length) {return [];}

            var toc = [];
            var currentLevel;
            while (elements.length &&
                   (currentLevel = parseInt($(elements[0]).attr('toc-level'))) >
                   parentLevel
                  ) {
              var el = $(elements[0]);
              var newTocElement = {
                id: el.attr('id'),
                text: el.attr('toc-text') || el.text(),
              };
              // kick out first element
              elements.shift();

              // get subtoc
              newTocElement.subToc = getToc(elements, currentLevel);

              // append new element
              toc.push(newTocElement);
            }

            return toc;
          }

          parsedToc.assign(scope, getToc());
        }
      };
    }]
  );

};
