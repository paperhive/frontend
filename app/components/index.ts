import avatar from './avatar';
import avatarList from './avatar-list';
import comment from './comment';
import feedbackButton from './feedback-button';
import navbarSearch from './navbar-search';
import navbarUser from './navbar-user';
import starButton from './star-button';
import starredDocs from './starred-docs';

export default function(app) {
  avatar(app);
  avatarList(app);
  comment(app);
  feedbackButton(app);
  navbarSearch(app);
  navbarUser(app);
  starButton(app);
  starredDocs(app);
};
