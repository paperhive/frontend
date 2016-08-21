'use strict';

import * as _ from 'lodash';

import template from './template.html';

export default function(app) {
  app.component(
    'searchResults',
    {
      template,
      controller: [
        'config', '$http', '$location', '$scope', 'feedbackModal', 'notificationService',
        function(config, $http, $location, $scope, feedbackModal, notificationService) {
          const maxPerPage = 10;

          $scope.search = {
            page: 1,
            maxSize: 7,
          };

          $scope.feedbackModal = feedbackModal;

          // update scope variables from location
          function updateFromLocation() {
            $scope.search.query = $location.search().query;
            $scope.search.page = $location.search().page || 1;

            $scope.search.period = $location.search().period || 'any';
            $scope.search.publishedAfter = parseInt($location.search().publishedAfter, 10) || 1900;
            $scope.search.publishedBefore = parseInt($location.search().publishedBefore, 10) || (new Date()).getFullYear();
            $scope.search.sortOrder = $location.search().sortOrder || 'desc';

            $scope.search.inTitle = ($location.search().inTitle === false ? false : true);
            $scope.search.inAuthors = ($location.search().inAuthors === false ? false : true);
            $scope.search.inAbstract = ($location.search().inAbstract === false ? false : true);

            $scope.search.journal = $location.search().journal || '';
            $scope.search.publisher = $location.search().publisher || '';

            $scope.search.tags = (Array.isArray($location.search().tag) ? $location.search().tag.join(',') : $location.search().tag) || '';
            $scope.search.tagsArray = (Array.isArray($location.search().tag) ? $location.search().tag : [$location.search().tag]) || [];

            if ($scope.search.publishedAfter !== 1900 || $scope.search.publishedBefore !== (new Date()).getFullYear()) {
              $scope.showSearchOptions = true;
              $scope.showSearchOptionPeriod = true;
            }

            if ($scope.search.tagsArray.length > 0) {
              $scope.showSearchOptions = true;
              $scope.showSearchOptionTags = true;
            }
          }
          updateFromLocation();
          $scope.$on('$locationChangeSuccess', updateFromLocation);

          // update location from scope variables
          function updateFromScope(page) {
            $location.search({
              query: $scope.search.query,
              page: page,
              period: $scope.search.period,
              publishedAfter: $scope.search.publishedAfter,
              publishedBefore: $scope.search.publishedBefore,
              sortOrder: $scope.search.sortOrder,
              inTitle: $scope.search.inTitle,
              inAuthors: $scope.search.inAuthors,
              inAbstract: $scope.search.inAbstract,
              journal: $scope.search.journal,
              publisher: $scope.search.publisher,
              tag: $scope.search.tags.split(',')
            });
          }

          function getSearchResults(query, page) {
            $scope.search.total = undefined;
            $scope.search.documents = undefined;

            const todayDate = new Date();
            const lastMonth = `0${todayDate.getMonth()}`.slice(-2);
            const lastMonthDays = `0${(new Date(todayDate.getFullYear(), (todayDate.getMonth()), 0)).getDate()}`.slice(-2);
            switch ($scope.search.period) {
              case 'any':
                $scope.search.publishedBefore = null;
                $scope.search.publishedAfter = null;
                break;
              case 'lastmonth':
                $scope.search.publishedAfter = `${todayDate.getFullYear()}-${lastMonth}-01`;
                $scope.search.publishedBefore = `${todayDate.getFullYear()}-${lastMonth}-${lastMonthDays}`;
                break;
              case 'lastyear':
                $scope.search.publishedAfter = `${(todayDate.getFullYear() - 1)}-01-01`;
                $scope.search.publishedBefore = `${(todayDate.getFullYear() - 1)}-12-31`;
                break;
              // case 'custom':
              //   $scope.search.publishedAfter = `${parseInt($scope.search.publishedAfter, 10)}-01-01`;
              //   $scope.search.publishedBefore = `${parseInt($scope.search.publishedBefore, 10)}-12-31`;
              //   break;
              default:
                break;
            }

            // $scope.search.searchIn = {
            //   title: true,
            //   authors: true,
            //   abstract: true
            // };

            return $http.get(config.apiUrl + '/documents/search', {
              params: {
                q: query,
                limit: maxPerPage,
                skip: (page - 1) * maxPerPage,
                restrictToLatest: true,
                publishedAfter: $scope.search.publishedAfter,
                publishedBefore: $scope.search.publishedBefore,
                sortBy: ($scope.search.sortOrder === 'asc' ? '+' : '-' ) + 'publishedAt',
                in: [
                  ($location.search().inTitle ? 'title' : undefined),
                  ($location.search().inAuthors ? 'authors' : undefined),
                  ($location.search().inAbstract ? 'abstract' : undefined),
                ],
                journal: $scope.search.journal,
                publisher: $scope.search.publisher,
                tag: $scope.search.tagsArray
              }
            })
            .then(
              function(response) {
                $scope.search.total = response.data.total;
                $scope.search.documents = response.data.documents;
              },
              function(response) {
                notificationService.notifications.push({
                  type: 'error',
                  message: 'Could not fetch documents'
                });
              }
            );
          };

          $scope.$watchGroup(['search.query', 'search.page', 'search.period', 'search.sortOrder', 'search.inTitle', 'search.inAuthors', 'search.inAbstract', 'search.publishedAfter', 'search.publishedBefore', 'search.journal', 'search.publisher', 'search.tags'], newValues => {
            let searchQuery = newValues[0];
            let searchPage = newValues[1];

            updateFromScope(searchPage);
            getSearchResults(searchQuery, searchPage);
          });

          $scope.scrollToTop = function() {
            window.scrollTo(0, 0);
          };

          $scope.filterForTag = function(tag) {
            $scope.search.tagsArray.push(tag.value);

            $scope.showSearchOptions = true;
            $scope.showSearchOptionTags = true;
          };

          $scope.getAllJournals = function() {
            let journals = [];

            _.forEach($scope.search.documents, document => {
              if (document && document.journal && _.indexOf(journals, document.journal.nameLong) === -1) {
                journals.push(document.journal.nameLong);
              }
            });

            return journals;
          };

          $scope.getAllPublishers = function() {
            let publishers = [];

            _.forEach($scope.search.documents, document => {
              if (_.indexOf(publishers, document.publisher) === -1) {
                publishers.push(document.publisher);
              }
            });

            return publishers;
          };

          $scope.getAllTags = function() {
            let tags = [];

            _.forEach($scope.search.documents, document => {
              _.forEach(document.tags, tag => {
                if (_.indexOf(tags, tag.value) === -1) {
                  tags.push(tag.value);
                }
              });
            });

            return tags;
          };

          $scope.getAllYears = function() {
            let years = [];

            for (let i = 1900; i <= (new Date()).getFullYear(); i++) {
              years.push(i);
            }

            return years;
          };

          $scope.filterForDate = function(dateString) {
            let dateObj = new Date(dateString);

            $scope.search.period = 'custom';
            $scope.search.publishedAfter = dateObj.getFullYear();
            $scope.search.publishedBefore = dateObj.getFullYear() + 1;

            $scope.showSearchOptions = true;
            $scope.showSearchOptionPeriod = true;
          };

          $scope.searchAtLeastInOne = function(item) {
            let score = 0;

            _.forEach(Object.keys($scope.search), attr => {
              if (attr.substring(0, 2) === 'in' && attr[2] === attr[2].toUpperCase()) {
                if ($scope.search[attr] === true) {
                  score++;
                }
              }
            });

            if (score > 1) {
                return false;
            } else {
              if ($scope.search[item] === false) {
                return false;
              } else {
                return true;
              }
            }
          };

        }
      ]
    });
};
