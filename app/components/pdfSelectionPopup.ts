import { cloneDeep, last } from 'lodash';

export default function(app) {
  app.component('pdfSelectionPopup', {
    bindings: {
      target: '<',
    },
    controller: class PdfSelectionPopupCtrl {
      static $inject = ['$http', '$scope', 'config', 'notificationService'];
      anchorId: string;

      constructor(public $http, public $scope, public config, public notificationService) {
        $scope.$watch('$ctrl.target', this.createAnchor.bind(this));
      }

      createAnchor(target) {
        // reset anchorId
        delete this.anchorId;

        if (!target) return;

        const newTarget = cloneDeep(target);
        delete newTarget.selectors.isBackwards;
        this.$http({
          url: `${this.config.apiUrl}/anchors`,
          method: 'post',
          data: {target: newTarget},
        }).then(
          response => this.anchorId = response.data.id,
          this.notificationService.httpError('could not create anchor')
        );
      }
    },
    template: `
    <url-share
      url="/a/{{$ctrl.anchorId}}"
      label="URL for this selection"
    ></url-share>
    `
  });
}
