import queryString from './query-string';
import range from './range';

export default function(app) {
  queryString(app);
  range(app);
}
