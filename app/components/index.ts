import gravatar from './gravatar';
import starButton from './star-button';
import starredDocs from './starred-docs';

export default function(app) {
  gravatar(app);
  starButton(app);
  starredDocs(app);
};
