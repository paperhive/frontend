import {PDFJS} from 'pdfjs-dist';

export default function(app) {
  app.component('pdf', {
    bindings: {
      url: '<',
      onUpdate: '&',
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

          // this object is passed to onUpdate
          const status = {
            bytesLoaded: undefined,
            bytesTotal: undefined,
            downloading: true,
            downloaded: false,
            pdf: undefined,
          };

          // set initial status
          ctrl.onUpdate({status});

          // do nothing if no URL was given
          if (!url) return;

          // get PDF
          const loadingTask = PDFJS.getDocument(url);
          loadingTask.onProgress = progress => {
            $scope.$apply(() => {
              // update download status
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
              status.pdf = pdf;
              ctrl.onUpdate({status});

            }),
            reason => $scope.$apply(() => {
              // error downloading pdf
              notificationService.notifications.push({
                type: 'error',
                message: reason || 'Could not download PDF.',
              });
              ctrl.onUpdate({status: {}});
            }),
          );
        });

        // clean up on destruction
        $scope.$on('$destroy', () => {
          if (ctrl.pdf) {
            ctrl.pdf.destroy();
          }
        });
      },
    ],
  });
};
