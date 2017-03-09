export default function(app) {
  app.component('documentSidenavPagination', {
    bindings: {
      pageNumber: '<',
      totalPageNumber: '<',
      onChange: '&',
    },
    controller: class DocumentSidenavPaginationCtrl {
      pageNumber: number;
      pageNumberModel: number;
      totalPageNumber: number;
      onChange: (o: {pageNumber: number}) => Promise<void>;

      static $inject = ['$scope'];
      constructor(public $scope) {
        $scope.$watch('$ctrl.pageNumber', pageNumber => this.pageNumberModel = pageNumber);
      }
    },
    template: require('./document-sidenav-pagination.html'),
  });
}
