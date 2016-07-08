/*global inject*/
'use strict';

describe('KramJax directive:', function() {
  var element;
  var $scope;

  beforeEach(module('paperhive'));

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    var $compile = _$compile_;
    var $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    element = $compile('<kramjax body="kramjaxBody"></kramjax>')($scope);
  }));

  it('should render inline plain text', function(done) {
    $scope.kramjaxBody = 'hello world';
    $scope.$digest();

    $scope.$on('FinishedMathJax', function() {
      expect(element.html()).toContain('<p>hello world</p>');
      done();
    });
  });

  it('should render inline markdown', function(done) {
    $scope.kramjaxBody = '*hello*';
    $scope.$digest();

    $scope.$on('FinishedMathJax', function() {
      expect(element.html()).toContain('<p><em>hello</em></p>');
      done();
    });
  });

  it('should render inline latex', function(done) {
    $scope.kramjaxBody = '$$\alpha$$';
    $scope.$digest();

    $scope.$on('FinishedMathJax', function() {
      expect(element.html()).toContain('<script type="math/tex; mode=display">alpha</script>');
      done();
    });
  });

  it('should render block plain text', function(done) {
    $scope.kramjaxBody = 'hello\n\nworld';
    $scope.$digest();

    $scope.$on('FinishedMathJax', function() {
      expect(element.html()).toContain('<p>hello</p>\n<p>world</p>');
      done();
    });
  });

  it('should render block markdown text', function(done) {
    $scope.kramjaxBody = '# hello';
    $scope.$digest();

    $scope.$on('FinishedMathJax', function() {
      expect(element.html()).toContain('<h1>hello</h1>');
      done();
    });
  });

  it('should render plain links', function(done) {
    $scope.kramjaxBody = 'https://paperhive.org/about';
    $scope.$digest();

    $scope.$on('FinishedMathJax', function() {
      expect(element.html()).toContain('<a href="https://paperhive.org/about">https://paperhive.org/about</a>');
      done();
    });
  });

  it('should render links with text', function(done) {
    $scope.kramjaxBody = '[about](https://paperhive.org/about)';
    $scope.$digest();

    $scope.$on('FinishedMathJax', function() {
      expect(element.html()).toContain('<a href="https://paperhive.org/about">about</a>');
      done();
    });
  });

  it('should render outbound links with target="_blank"', function(done) {
    $scope.kramjaxBody = '[google](https://google.com)';
    $scope.$digest();

    $scope.$on('FinishedMathJax', function() {
      expect(element.html()).toContain('<a href="https://google.com" target="_blank">google</a>');
      done();
    });
  });

  it('should render block latex text', function(done) {
    $scope.kramjaxBody = 'hello\n$$\alpha$$\n\nworld';
    $scope.$digest();

    $scope.$on('FinishedMathJax', function() {
      expect(element.html()).toContain('<p>hello</p>\n<script type="math/tex; mode=display">alpha</script><p>world</p>');
      done();
    });
  });

});
