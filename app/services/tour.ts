import {localStorageAvailable} from '../utils/local-storage';

const urls = {
  start: require('!ngtemplate-loader?relativeTo=/app!html-loader!./tour-start.html'),
  marginDiscussion: require('!ngtemplate-loader?relativeTo=/app!html-loader!./tour-margin-discussion.html'),
  highlight: require('!ngtemplate-loader?relativeTo=/app!html-loader!./tour-highlight.html'),
  search: require('!ngtemplate-loader?relativeTo=/app!html-loader!./tour-search.html'),
  hive: require('!ngtemplate-loader?relativeTo=/app!html-loader!./tour-hive.html'),
  signup: require('!ngtemplate-loader?relativeTo=/app!html-loader!./tour-signup.html'),
};

export default function(app) {
  app.service('tourService', class TourService {
    stages = [
      'start',
      'margin-discussion',
      'highlight',
      'search',
      'hive',
      'signup',
    ];
    index = 0;
    urls = urls;
    visited = false;

    static $inject = ['$location', '$window', 'authService'];

    constructor(public $location, public $window, public authService) {
      // get tourVisited from localStorage
      if (localStorageAvailable) {
        this.visited = $window.localStorage.tourVisited;
      }
    }

    increaseIndex() {
      this.index++;

      // do not show the tour next time when the last stage has been reached
      if (this.index === this.stages.length - 1 ||
          this.authService.user && (this.index === this.stages.length - 2)
          ) {
        this.visited = true;
        if (localStorageAvailable) {
          this.$window.localStorage.tourVisited = true;
        }
      }
    }

    // begin with margin discussion
    start() {
      // reset visited flag
      this.visited = false;
      if (localStorageAvailable) {
        this.$window.localStorage.tourVisited = false;
      }

      this.index = 1;
      this.$location.url('/documents/0tsHJq1-yyVZ');
    }

    setUndefined() {
      this.index = undefined;
    }

    reject() {
      this.visited = true;
      if (localStorageAvailable) {
        this.$window.localStorage.tourVisited = true;
      }

      this.index = undefined;
    }
  });
};
