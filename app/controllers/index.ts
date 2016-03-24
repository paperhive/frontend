import documentText from './documentText';
import authReturn from './authReturn';
import discussionList from './discussionList';
import hivers from './hivers';
import meta from './meta';
import jobs from './jobs';
import passwordRequest from './passwordRequest';

export default function(app) {
  documentText(app);
  authReturn(app);
  discussionList(app);
  hivers(app);
  meta(app);
  jobs(app);
  passwordRequest(app);
};
