export default function(app) {
  // example: {{ {foo: 1, bar: '/about'} | queryString}}
  //          yields foo=1&bar=%2Fabout
  app.filter('queryString', ['$httpParamSerializer', ($httpParamSerializer) => {
    return $httpParamSerializer;
  }]);
}
