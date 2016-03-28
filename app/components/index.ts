import about from './about/index';
import avatar from './avatar';
import avatarList from './avatar-list';
import comment from './comment/index';
import contact from './contact/index';
import discussionList from './discussion-list/index';
import discussionThreadView from './discussion-thread-view/index';
import document from './document/index';
import documentNew from './document-new/index';
import extensionButtons from './extension-buttons/index';
import feedbackButton from './feedback-button';
import hiveButton from './hive-button';
import hivedDocs from './hived-docs';
import hivers from './hivers/index';
import inlineEditable from './inline-editable/index';
import legalNotice from './legal-notice/index';
import login from './login/index';
import marginDiscussion from './margin-discussion/index';
import marginDiscussionDraft from './margin-discussion-draft/index';
import navbar from './navbar/index';
import navbarSearch from './navbar-search/index';
import navbarUser from './navbar-user/index';
import newReply from './new-reply/index';
import notFound from './not-found/index';
import notifications from './notifications/index';
import officeMap from './office-map';
import passwordRequest from './passwordRequest';
import passwordReset from './passwordReset';
import searchResults from './search-results/index';
import settings from './settings/index';
import settingsAccounts from './settings-accounts';
import settingsEmail from './settings-email';
import settingsProfile from './settings-profile/index';
import signup from './signup/index';
import subscribe from './subscribe/index';
import terms from './terms/index';
import user from './user/index';
import userProfile from './user-profile/index';

export default function(app) {
  about(app);
  avatar(app);
  avatarList(app);
  comment(app);
  contact(app);
  discussionList(app);
  discussionThreadView(app);
  document(app);
  documentNew(app);
  extensionButtons(app);
  feedbackButton(app);
  hiveButton(app);
  hivedDocs(app);
  hivers(app);
  inlineEditable(app);
  legalNotice(app);
  login(app);
  marginDiscussion(app);
  marginDiscussionDraft(app);
  navbar(app);
  navbarSearch(app);
  navbarUser(app);
  newReply(app);
  notFound(app);
  notifications(app);
  officeMap(app);
  passwordRequest(app);
  passwordReset(app);
  searchResults(app);
  settings(app);
  settingsAccounts(app);
  settingsEmail(app);
  settingsProfile(app);
  signup(app);
  subscribe(app);
  terms(app);
  user(app);
  userProfile(app);
};
