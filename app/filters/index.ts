import highlightsByPageNumber from './highlights-by-page-number';
import queryString from './query-string';
import range from './range';

export default function(app) {
  highlightsByPageNumber(app);
  queryString(app);
  range(app);
}
