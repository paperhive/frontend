import jquery from 'jquery';
import _ from 'lodash';

export default function(app) {

  app.directive(
    'toc',
    ['$parse', '$window', '$timeout', function($parse, $window, $timeout) {
      return {
        restrict: 'A',
        link: (scope, element, attrs) => {
          const parsedToc = $parse(attrs.toc);
          const parsedOffset = $parse(attrs.tocScrollspyOffset);
          let toc;

          function getElements(): HTMLElement[] {
            return element.find('[id]').filter(function(index, el) {
              return parseInt(jquery(el).attr('toc-level'), 10);
            }).toArray();
          }

          function getToc(elements, parentLevel) {
            if (elements === undefined) {
              elements = getElements();
              parentLevel = Number.NEGATIVE_INFINITY;
            }
            if (!elements.length) { return []; }

            const newToc = [];
            let currentLevel;
            while (elements.length &&
                   // tslint:disable-next-line:no-conditional-assignment
                   (currentLevel = parseInt(jquery(elements[0]).attr('toc-level'), 10)) >
                   parentLevel
                  ) {
              const el = jquery(elements[0]);
              const newTocElement = {
                id: el.attr('id'),
                text: el.attr('toc-text') || el.text(),
                subToc: undefined,
              };
              // kick out first element
              elements.shift();

              // get subtoc
              newTocElement.subToc = getToc(elements, currentLevel);

              // append new element
              newToc.push(newTocElement);
            }

            return newToc;
          }

          function updateScrollspy() {
            function getScrollspyId() {
              const elements = _.sortBy(_.map(getElements(), _element => {
                const rect = _element.getBoundingClientRect();
                return {
                  id: jquery(_element).attr('id'),
                  offset: rect.top,
                };
              }), 'offset');
              const offset = parsedOffset(scope) || 0;

              if (!elements.length) { return; }

              let id = elements[0].id;
              _.forEach(elements, function(_element) {
                if (_element.offset < offset) {
                  id = _element.id;
                }
              });

              return id;
            }

            function applyScrollspyId(_toc, id) {
              if (!_toc) { return; }
              let contained = false;
              _.forEach(_toc, function(entry: any) {
                entry.active = false;
                if (applyScrollspyId(entry.subToc, id) || entry.id === id) {
                  entry.active = true;
                  contained = true;
                }
              });
              return contained;
            }

            scope.$apply(function() {
              const id = getScrollspyId();
              applyScrollspyId(toc, id);
            });
          }

          $timeout(function() {
            // set toc
            toc = getToc(undefined, undefined);

            // register handler
            jquery($window).on('scroll resize', updateScrollspy);
            element.on('$destroy', function() {
              jquery($window).off('scroll resize', updateScrollspy);
            });
            updateScrollspy();

            parsedToc.assign(scope, toc);
          });
        },
      };
    }],
  );
}
