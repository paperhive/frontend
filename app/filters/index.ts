import queryString from './queryString';
import range from './range';

export default function(app) {
  queryString(app);
  range(app);
}
