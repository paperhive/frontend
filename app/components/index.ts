import avatar from './avatar';
import avatarList from './avatar-list';
import comment from './comment';
import feedbackButton from './feedback-button';
import hiveButton from './hive-button';
import hivedDocs from './hived-docs';
import navbarSearch from './navbar-search';
import navbarUser from './navbar-user';

export default function(app) {
  avatar(app);
  avatarList(app);
  comment(app);
  feedbackButton(app);
  hiveButton(app);
  hivedDocs(app);
  navbarSearch(app);
  navbarUser(app);
};
