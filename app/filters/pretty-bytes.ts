import prettyBytes from 'pretty-bytes';

export default function(app) {
  app.filter('prettyBytes', () => input => input !== undefined ? prettyBytes(input) : '');
}
