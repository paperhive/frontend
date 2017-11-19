import prettyBytes from './pretty-bytes';
import queryString from './query-string';
import range from './range';

export default function(app) {
  prettyBytes(app);
  queryString(app);
  range(app);
}
