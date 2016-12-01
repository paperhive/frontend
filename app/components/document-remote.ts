class DocumentRemoteCtrl {
  static $inject =
    ['$http', '$location', '$routeSegment', 'config', 'notificationService'];
  constructor($http, $location, $routeSegment, config, notificationService) {
    // get type and id parameter
    const type = $location.search().type;
    const id = $location.search().id;
    if (!type || !id) {
      notificationService.notifications.push({
        type: 'error',
        message: 'type or id parameter is missing.'
      });
      return;
    }

    // determine document
    $http({
      url: `${config.apiUrl}/documents/remote`,
      params: {type, id},
    }).then(
      response => {
        const document = response.data;

        // get target URL
        const targetUrl = $routeSegment.getSegmentUrl('documents.revisions', {
          documentId: document.id,
          revisionId: document.revision,
        });

        // redirect
        $location.url(targetUrl);
      },
      response => {
        notificationService.notifications.push({
          type: 'error',
          message: response.data && response.data.message ||
            `Document with type ${type} and id ${id} could not be retrieved for an unknown reason.`
        });
      }
    );
  }
}

export default function(app) {
  app.component('documentRemote', {
    controller: DocumentRemoteCtrl
  });
}
