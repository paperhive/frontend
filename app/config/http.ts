export default function (app) {
  // add token as Authorization header to PaperHive API request
  app.factory('paperhiveHttpInterceptor', [
    'authState', 'config', (authState, config) => {
      return {
        request: request => {
          // request to PaperHive API?
          if (request.headers.Authorization === undefined &&
            authState.token &&
            request.url.indexOf(config.apiUrl) === 0
          ) {
            request.headers.Authorization = `token ${authState.token}`;
          }
          return request;
        },
      };
    },
  ]);

  app.config(['$httpProvider', function($httpProvider){
    $httpProvider.interceptors.push('paperhiveHttpInterceptor');
  }]);
}
