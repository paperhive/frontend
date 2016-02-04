/*global inject*/
'use strict';

describe('KramJax directive', function() {
  var $compile;
  var $rootScope;

  beforeEach(module('paperhive'));

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('renders plain text', function() {

    // setup scope
    var $scope = $rootScope.$new();
    $scope.kramjaxBody = 'hello world';

    // compile directive with new scope and digest
    var element = $compile('<kramjax body="kramjaxBody"></kramjax>')($scope);
    $scope.$digest();

    // check html
    expect(element.html()).toContain('hello world');
  });
});
