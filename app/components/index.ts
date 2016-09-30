import about from './about';
import activity from './activity';
import authReturn from './auth-return';
import avatar from './avatar';
import avatarList from './avatar-list';
import channel from './channel';
import channels from './channels';
import channelNew from './channel-new';
import comment from './comment';
import contact from './contact';
import discussionList from './discussion-list';
import discussionThreadView from './discussion-thread-view';
import document from './document';
import documentItem from './document-item';
import documentNew from './document-new';
import documentRedirect from './document-redirect';
import documentText from './document-text';
import documentsList from './documents-list';
import extensionButtons from './extension-buttons';
import feedback from './feedback';
import feedbackButton from './feedback-button';
import helpMarkdown from './help-markdown';
import hiveButton from './hive-button';
import hivedDocs from './hived-docs';
import hivers from './hivers';
import jobs from './jobs';
import inlineEditable from './inline-editable';
import legalNotice from './legal-notice';
import login from './login';
import mainPage from './main-page';
import marginLink from './margin-link';
import marginDiscussion from './margin-discussion';
import marginDiscussionDraft from './margin-discussion-draft';
import marginDiscussionEdit from './margin-discussion-edit';
import marginDiscussionPlaceholder from './margin-discussion-placeholder';
import marginDiscussions from './margin-discussions';
import marginReplyEdit from './margin-reply-edit';
import navbar from './navbar';
import navbarSearch from './navbar-search';
import navbarUser from './navbar-user';
import newReply from './new-reply';
import notFound from './not-found';
import notifications from './notifications';
import officeMap from './office-map';
import partnerLogos from './partner-logos';
import passwordRequest from './password-request';
import passwordReset from './password-reset';
import pdf from './pdf';
import pdfHighlight from './pdf-highlight';
import pdfPopup from './pdf-popup';
import pdfSelectionPopup from './pdf-selection-popup';
import phFooter from './ph-footer';
import publishers from './publishers';
import searchResults from './search-results';
import settings from './settings';
import settingsAccounts from './settings-accounts';
import settingsEmail from './settings-email';
import settingsProfile from './settings-profile';
import signup from './signup';
import subscribe from './subscribe';
import subscribed from './subscribed';
import supporterLogos from './supporter-logos';
import terms from './terms';
import urlShare from './url-share';
import user from './user';
import userProfile from './user-profile';

export default function(app) {
  about(app);
  activity(app);
  authReturn(app);
  avatar(app);
  avatarList(app);
  channel(app);
  channels(app);
  channelNew(app);
  comment(app);
  contact(app);
  discussionList(app);
  discussionThreadView(app);
  document(app);
  documentItem(app);
  documentNew(app);
  documentRedirect(app);
  documentText(app);
  documentsList(app);
  extensionButtons(app);
  feedback(app);
  feedbackButton(app);
  helpMarkdown(app);
  hiveButton(app);
  hivedDocs(app);
  hivers(app);
  jobs(app);
  inlineEditable(app);
  legalNotice(app);
  login(app);
  mainPage(app);
  marginLink(app);
  marginDiscussion(app);
  marginDiscussionDraft(app);
  marginDiscussionEdit(app);
  marginDiscussionPlaceholder(app);
  marginDiscussions(app);
  marginReplyEdit(app);
  navbar(app);
  navbarSearch(app);
  navbarUser(app);
  newReply(app);
  notFound(app);
  notifications(app);
  officeMap(app);
  partnerLogos(app);
  passwordRequest(app);
  passwordReset(app);
  pdf(app);
  pdfHighlight(app);
  pdfPopup(app);
  pdfSelectionPopup(app);
  phFooter(app);
  publishers(app);
  searchResults(app);
  settings(app);
  settingsAccounts(app);
  settingsEmail(app);
  settingsProfile(app);
  signup(app);
  subscribe(app);
  subscribed(app);
  supporterLogos(app);
  terms(app);
  urlShare(app);
  user(app);
  userProfile(app);
};
