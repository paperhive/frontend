import avatar from './avatar';
import feedbackButton from './feedback-button';
import navbarUser from './navbar-user/index';
import starButton from './star-button';
import starredDocs from './starred-docs';

export default function(app) {
  avatar(app);
  feedbackButton(app);
  navbarUser(app);
  starButton(app);
  starredDocs(app);
};
