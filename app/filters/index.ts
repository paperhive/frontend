import highlightsByPageNumber from './highlightsByPageNumber';
import queryString from './queryString';
import range from './range';

export default function(app) {
  highlightsByPageNumber(app);
  queryString(app);
  range(app);
}
