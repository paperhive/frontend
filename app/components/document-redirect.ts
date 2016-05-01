import { get } from 'lodash';

class DocumentRedirectCtrl {
  static $inject =
    ['$http', '$location', '$routeSegment', 'config', 'notificationService'];
  constructor($http, $location, $routeSegment, config, notificationService) {
    // get url parameter
    const url = $location.search().url;
    if (!url) {
      notificationService.notifications.push({
        type: 'error',
        message: 'URL parameter is missing.'
      });
      return;
    }

    // determine document
    $http({
      url: `${config.apiUrl}/documents/search`,
      params: {url},
    }).then(
      response => {
        // do we have a document?
        const document = get(response, 'data.documents[0]');
        if (!document) {
          notificationService.notifications.push({
            type: 'error',
            message: `No document found for URL ${url}.`
          });
          return;
        }

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
            `Obtaining document for URL ${url} failed for an unknown reason.`
        });
      }
    );
  }
}

export default function(app) {
  app.component('documentRedirect', {
    controller: DocumentRedirectCtrl
  });
}
