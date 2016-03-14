import { range } from 'lodash';

export default function(app) {
  // example: {{ {foo: 1, bar: '/about'} | queryString}}
  //          yields foo=1&bar=%2Fabout
  app.filter('range', () => {
    return (input, start, end, step) => range(start, end, step);
  });
}
