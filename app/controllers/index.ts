import documentText from './documentText';
import meta from './meta';
import jobs from './jobs';
import passwordRequest from './passwordRequest';

export default function(app) {
  documentText(app);
  meta(app);
  passwordRequest(app);
};
