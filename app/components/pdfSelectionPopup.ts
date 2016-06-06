import { cloneDeep, last } from 'lodash';

export default function(app) {
  app.component('pdfSelectionPopup', {
    bindings: {
      target: '<',
    },
    controller: class PdfSelectionPopupCtrl {
      static $inject = ['$http', '$scope', 'config'];
      constructor(public $http, public $scope, public config) {
        $scope.$watch('$ctrl.target', target => {
          // reset anchorId
          this.anchorId = undefined

          if (!target) return;

          const newTarget = cloneDeep(target);
          delete newTarget.selectors.isBackwards;
          $http({
            url: `${config.apiUrl}/anchors`,
            method: 'post',
            data: {target: newTarget},
          }).then(
            response => this.anchorId = response.data.id,
            response => console.log(response) // TODO
          );
        });
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
