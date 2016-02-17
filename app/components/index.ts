import feedbackButton from './feedback-button';
import gravatar from './gravatar';
import starButton from './star-button';
import starredDocs from './starred-docs';

export default function(app) {
  feedbackButton(app);
  gravatar(app);
  starButton(app);
  starredDocs(app);
};
