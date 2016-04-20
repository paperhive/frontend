import template from './discussion-thread-root.html!text';

class DiscussionsThreadRoot {
  static $inject = ['$scope', 'authService'];
  constructor(public $scope, public authService) {
    // TODO
  }
}

export default function(app) {
  app.component('discussionThreadRoot', {
    template,
    bindings: {
      discussion: '<',
      onDiscussionUpdate: '&',
    },
    controller: DiscussionsThreadRoot,
  });
}
