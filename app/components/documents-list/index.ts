'use strict';

import { compact, flatten, get } from 'lodash';

import template from './template.html!text';

// knowledge unlatched ids
// TODO: get rid of this!
const kuCategories = [
  {
    category: 'Antropology',
    oapenIds: ['605035', '604531', '605861', '605031', '605021', '605457', '606219', '605458'],
  },
  {
    category: 'History',
    oapenIds: ['604618', '604532', '605050', '605028', '604623', '605041', '605452', '605040', '604619'],
  },
  {
    category: 'Literature',
    oapenIds: ['604621', '605859', '607150', '604622', '605455', '605043'],
  },
  {
    category: 'Media and Communications',
    oapenIds: ['605039', '605038', '605454', '605860', '605453', '605853', '605051'],
  },
  {
    category: 'Politics',
    oapenIds: ['605025', '605858', '605854', '606216', '605451', '604620', '606236', '605032', '605456'],
  },
  {
    category: 'Duke University Press',
    oapenIds: ['604612', '605855', '605857', '605450', '604616', '604614', '604617', '604613', '604610', '604615'],
  },
];

export default function(app) {
  app.component('documentsList', {
    controller: class DocumentsListCtrl {
      categories: Array<any>;

      static $inject = ['$http', '$scope', 'config'];
      constructor(public $http, public $scope, public config) {
        this.getKU();
      }

      async getKU() {
        const oapenDocuments = {};

        const oapenIds = flatten(kuCategories.map(item => item.oapenIds));

        await Promise.all(oapenIds.map(id => {
          return this.$http({
            url: `${this.config.apiUrl}/documents/search`,
            params: {url: `http://oapen.org/search?identifier=${id}`},
          }).then(
            response => {
              const document = get(response, 'data.documents[0]');
              oapenDocuments[id] = document;
            }
          );
        }));

        // this code runs async, so let's $apply the changes!
        this.$scope.$apply(() => {
          this.categories = kuCategories.map(item => ({
            category: item.category,
            documents: compact(item.oapenIds.map(id => oapenDocuments[id])),
          }));
        });

      }
    },
    template,
  });
};
