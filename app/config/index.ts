import animate from './animate';
import debug from './debug';
import html5Mode from './html5-mode';
import http from './http';
import logging from './logging';
import mathjax from './mathjax';
import metaUpdate from './meta-update';
import pdf from './pdf';
import preAssignBindings from './pre-assign-bindings';
import routes from './routes';
import scroll from './scroll';

export default function(app) {
  animate(app);
  debug(app);
  html5Mode(app);
  http(app);
  logging(app);
  mathjax(app);
  metaUpdate(app);
  pdf(app);
  preAssignBindings(app);
  routes(app);
  scroll(app);
};
