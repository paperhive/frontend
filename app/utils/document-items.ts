export function isDocumentItemSharedWithUser(documentItem, user) {
  return documentItem
    && documentItem.channelShares
    && user
    && documentItem.channelShares.find(share => share.person !== user.id);
}
