import * as angular from 'angular';

export function getRevisionMetadata(revision) {
  // TODO: Cut description down to 150 chars? cf.
  // <http://moz.com/learn/seo/meta-description>
  const metadata = [
    {
      name: 'description',
      content: revision.title + ' by ' + revision.authors.join(', ') + '.',
    },
    {
      name: 'author',
      content: revision.authors.map(author => author.name).join(', '),
    },
    {name: 'keywords', content: revision.tags.join(', ')},
  ];

  // Add some Highwire Press tags, used by Google Scholar, arXiv etc.; cf.
  // <http://webmasters.stackexchange.com/a/13345/15250>.
  // TODO add some more, if possible (citation_journal etc)
  // Check out
  // <https://scholar.google.com/intl/en/scholar/inclusion.html#indexing>
  // for more info.
  metadata.push({name: 'citation_title', content: revision.title});

  // Both "John Smith" and "Smith, John" are fine.
  revision.authors.forEach(author => {
    metadata.push({name: 'citation_author', content: author.name});
  });

  // citation_publication_date: REQUIRED for Google Scholar.
  const $filter = angular.injector(['ng']).get('$filter');
  metadata.push({
    name: 'citation_publication_date',
    content: $filter('date')(revision.publishedAt, 'yyyy/MM/dd'),
  });

  // Don't expose the DOI for all versions of the document; it really only
  // identifies one version, usually not the arXiv one, but an upstream
  // version.
  // if ($scope.pdfSource) {
  //   metaData.push({name: 'citation_pdf_url', content: $scope.pdfSource});
  // }

  return metadata;
}
