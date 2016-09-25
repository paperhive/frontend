import { find } from 'lodash';

export default function(app) {
  app.filter('highlightsByPageNumber', [() => {
    return (highlights, pageNumber) => {
      return highlights.filter(highlight => find(highlight.selectors.pdfRectangles, {pageNumber}));
    };
  }]);
}
