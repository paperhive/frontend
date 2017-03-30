require('./document-sidenav-pagination.less');

export default function(app) {
  app.component('documentSidenavPagination', {
    bindings: {
      large: '<',
      pageNumber: '<',
      totalPageNumber: '<',
      onChange: '&',
    },
    controller: class DocumentSidenavPaginationCtrl {
      pageNumber: number;
      pageNumberModel: string;
      totalPageNumber: number;
      onChange: (o: {pageNumber: number}) => Promise<void>;

      static $inject = ['$scope'];
      constructor(public $scope) {
        $scope.$watch('$ctrl.pageNumber', pageNumber => this.pageNumberModel = pageNumber);
      }

      submit() {
        const pageNumber = parseInt(this.pageNumberModel, 10);
        if (isNaN(pageNumber)) throw new Error('page number is not an integer');
        if (pageNumber < 1 || pageNumber > this.totalPageNumber) {
          throw new Error('page number out of range');
        }
        this.onChange({pageNumber});
      }
    },
    template: require('./document-sidenav-pagination.html'),
  });
}
