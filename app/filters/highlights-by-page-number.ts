import { filter, find, get } from 'lodash';

export default function(app) {
  // example: {{ {foo: 1, bar: '/about'} | queryString}}
  //          yields foo=1&bar=%2Fabout
  app.filter('highlightsByPageNumber', [() => {
    return (highlights, pageNumber) => {

      return filter(highlights, highlight => {
        const rectangles = get(highlight, 'selectors.pdfRectangles');
        return find(rectangles, {pageNumber});
      });
    };
  }]);
}
