import documentText from './documentText';
import authReturn from './authReturn';
import meta from './meta';
import jobs from './jobs';
import passwordRequest from './passwordRequest';

export default function(app) {
  documentText(app);
  authReturn(app);
  meta(app);
  jobs(app);
  passwordRequest(app);
};
