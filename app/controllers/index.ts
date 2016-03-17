import document from './document';
import documentText from './documentText';
import authReturn from './authReturn';
import contact from './contact';
import discussionList from './discussionList';
import hivers from './hivers';
import meta from './meta';
import jobs from './jobs';
import passwordRequest from './passwordRequest';

export default function(app) {
  document(app);
  documentText(app);
  authReturn(app);
  contact(app);
  discussionList(app);
  hivers(app);
  meta(app);
  jobs(app);
  passwordRequest(app);
};
