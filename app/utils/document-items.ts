import angular from 'angular';

export function getDescription(documentItem) {
  if (!documentItem) return;

  // arxiv
  switch (documentItem.remote.type) {
    case 'arxiv':
      // For arXiv, concatenate the remote name and the version without comma.
      return `arXiv ${documentItem.remote.revision}`;

    case 'langsci': {
      const rev = documentItem.remote.revision === 'openreview' ?
        'open review' : documentItem.remote.revision;
      return `LangSci ${rev}`;
    }

    case 'transcript':
      return documentItem.metadata.publisher;

    case 'oapen':
      return 'OAPEN';
  }

  // prefer short/shortened journal name
  if (documentItem.metadata.journalShort) {
    return documentItem.metadata.journalShort;
  }

  if (documentItem.metadata.journal) {
    return documentItem.metadata.journal;
  }

  if (documentItem.metadata.publisher) {
    return documentItem.metadata.publisher;
  }

  // isbn
  if (documentItem.metadata.isbn) {
    return `ISBN ${documentItem.metadata.isbn}`;
  }

  // fallback: remote with revision or id
  if (documentItem.remote.revision) {
    return `${documentItem.remote.type}, ${documentItem.remote.revision}`;
  }
  return `${documentItem.remote.type}, ${documentItem.remote.id}`;
}

export function getHTMLMetadata(documentItem) {
  // TODO: Cut description down to 150 chars? cf.
  // <http://moz.com/learn/seo/meta-description>
  const authors = documentItem.metadata.authors.map(author => author.name).join(', ');
  const metadata = [
    {
      name: 'description',
      content: documentItem.metadata.title + ' by ' + authors + '.',
    },
    {
      name: 'author',
      content: authors,
    },
    {name: 'keywords', content: documentItem.metadata.tags.join(', ')},
  ];

  // Add some Highwire Press tags, used by Google Scholar, arXiv etc.; cf.
  // <http://webmasters.stackexchange.com/a/13345/15250>.
  // TODO add some more, if possible (citation_journal etc)
  // Check out
  // <https://scholar.google.com/intl/en/scholar/inclusion.html#indexing>
  // for more info.
  metadata.push({name: 'citation_title', content: documentItem.metadata.title});

  // Both "John Smith" and "Smith, John" are fine.
  documentItem.metadata.authors.forEach(author => {
    metadata.push({name: 'citation_author', content: author.name});
  });

  // citation_publication_date: REQUIRED for Google Scholar.
  const $filter = angular.injector(['ng']).get('$filter');
  metadata.push({
    name: 'citation_publication_date',
    content: $filter('date')(documentItem.metadata.publishedAt, 'yyyy/MM/dd'),
  });

  // Don't expose the DOI for all versions of the document; it really only
  // identifies one version, usually not the arXiv one, but an upstream
  // version.
  // if ($scope.pdfSource) {
  //   metaData.push({name: 'citation_pdf_url', content: $scope.pdfSource});
  // }

  return metadata;
}

export function isDocumentItemBookmarkedInChannel(documentItem, channel) {
  return documentItem
    && documentItem.channelBookmarks
    && channel
    && documentItem.channelBookmarks.find(bookmark => bookmark.channel === channel.id);
}

export function isDocumentItemSharedInChannel(documentItem, channel) {
  return documentItem
    && documentItem.channelShares
    && channel
    && documentItem.channelShares.find(share => share.channel === channel.id);
}

export function isDocumentItemOwnedByUser(documentItem, user) {
  return documentItem &&
    documentItem.owner &&
    user &&
    documentItem.owner === user.id;
}

export function isDocumentItemSharedWithUser(documentItem, user) {
  return documentItem
    && documentItem.channelShares
    && user
    && documentItem.channelShares.find(share => share.person !== user.id);
}

function getDocumentItemScore(documentItem) {
  switch (documentItem.remote.type) {
    case 'upload':
      return 3;
    case 'berghahnBooks':
    case 'langsci':
    case 'transcript':
      return 2;
    case 'crossref':
      return 1;
    default:
      return 0;
  }
}

function sortRevisionDocumentItems(documentItems) {
  return documentItems.sort((a, b) => getDocumentItemScore(b) - getDocumentItemScore(a));
}

export function groupDocumentItemsByRevision(documentItems) {
  const byRevision = {};
  documentItems.forEach(documentItem => {
    const { revision } = documentItem;
    byRevision[revision] = [...(byRevision[revision] || []), documentItem];
  });
  Object.keys(byRevision).forEach(revision => {
    byRevision[revision] = sortRevisionDocumentItems(byRevision[revision]);
  });
  return byRevision;
}
