import avatar from './avatar';
import starButton from './star-button';
import starredDocs from './starred-docs';

export default function(app) {
  avatar(app);
  starButton(app);
  starredDocs(app);
};
