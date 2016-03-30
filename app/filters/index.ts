import highlightsByPage from './highlightsByPage';
import queryString from './queryString';
import range from './range';

export default function(app) {
  highlightsByPage(app);
  queryString(app);
  range(app);
}
