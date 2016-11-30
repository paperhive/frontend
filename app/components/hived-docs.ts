export default function(app) {
    app.component('hivedDocs', {
      bindings: {
        personId: '<',
      },
      controller: [
        '$scope', '$element', '$attrs', '$http', 'config', 'notificationService',
        function($scope, $element, $attrs, $http, config, notificationService) {
          const ctrl = this;

          $scope.$watch('$ctrl.personId', async function(id) {
            if (!id) { return; }
            try {
              const ret = await $http.get(
                config.apiUrl +
                  '/people/' + id + '/hives'
              );
              ctrl.hivedDocuments = ret.data.documents;
            } catch (err) {
              notificationService.notifications.push({
                type: 'error',
                message: err.data.message ? err.data.message :
                  'could not fetch hived documents (unknown reason)'
              });
            }
            // This is an async function, so unless we $apply, angular won't
            // know that values have changed.
            $scope.$apply();
          });
        }],
        template:
        `<div class="list-group">
          <a ng-repeat="doc in $ctrl.hivedDocuments" href="./documents/{{doc.id}}" class="list-group-item">
            <h4 class="list-group-item-heading">{{doc.title}}</h4>
            <p class="list-group-item-text">
              <span ng-repeat="author in doc.authors">
                {{author.name}}{{$last ? '' :', '}}
              </span>
            </p>
          </a>
        </div>`
    });
};
