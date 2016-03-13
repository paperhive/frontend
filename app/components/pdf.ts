import {PDFJS} from 'pdfjs-dist';

export default function(app) {
  app.component('pdf', {
    bindings: {
      url: '<',
      onStatusUpdate: '&',
    },
    controller: [
      '$scope', 'notificationService',
      function ($scope, notificationService) {
        const ctrl = this;

        $scope.$watch('$ctrl.url', url => {
          // reset
          if (ctrl.pdf) {
            ctrl.pdf.destroy();
            ctrl.pdf = undefined;
          }

          // this object is passed to onStatusUpdate
          const status = {
            bytesLoaded: undefined,
            bytesTotal: undefined,
            downloading: true,
            downloaded: false,
            info: undefined,
            numPages: undefined,
          };

          // get PDF
          ctrl.onStatusUpdate({status});
          const loadingTask = PDFJS.getDocument(url);

          // update download status
          loadingTask.onProgress = progress => {
            $scope.$apply(() => {
              status.bytesLoaded = progress.loaded;
              status.bytesTotal = progress.total;
            });
          };

          // update when download finished
          loadingTask.then(
            pdf => $scope.$apply(() => {
              // successfully downloaded pdf
              ctrl.pdf = pdf;
              status.downloading = false;
              status.downloaded = true;
              status.info = pdf.info;
              status.numPages = pdf.numPages;
              ctrl.onStatusUpdate({status});
            }),
            error => $scope.$apply(() => {
              // error downloading pdf
              notificationService.notifications.push({
                type: 'error',
                message: error.message || 'Could not download PDF.',
              });
              ctrl.onStatusUpdate({status: {}});
            })
          );
        });
      }
    ],
    transclude: true,
  });
};
