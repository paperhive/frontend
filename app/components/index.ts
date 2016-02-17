import avatar from './avatar';
import feedbackButton from './feedback-button';
import starButton from './star-button';
import starredDocs from './starred-docs';

export default function(app) {
  avatar(app);
  feedbackButton(app);
  starButton(app);
  starredDocs(app);
};
