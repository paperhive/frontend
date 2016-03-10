import document from './document';
import documentText from './documentText';
import documentNew from './documentNew';
import authReturn from './authReturn';
import comment from './comment';
import contact from './contact';
import discussion from './discussion';
import discussionList from './discussionList';
import hivers from './hivers';
import intro from './intro';
import meta from './meta';
import help from './help';
import jobs from './jobs';
import login from './login';
import navbar from './navbar';
import notifications from './notifications';
import passwordRequest from './passwordRequest';
import searchResults from './searchResults';
import settings from './settings';
import signup from './signup';
import subscribe from './subscribe';
import user from './user';

export default function(app) {
  document(app);
  documentText(app);
  documentNew(app);
  authReturn(app);
  comment(app);
  contact(app);
  discussion(app);
  discussionList(app);
  hivers(app);
  intro(app);
  meta(app);
  help(app);
  jobs(app);
  login(app);
  navbar(app);
  notifications(app);
  passwordRequest(app);
  searchResults(app);
  settings(app);
  signup(app);
  subscribe(app);
  user(app);
};
