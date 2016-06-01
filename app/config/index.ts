'use strict';

import animate from './animate';
import html5Mode from './html5Mode';
import http from './http';
import logging from './logging';
import mathjax from './mathjax';
import metaUpdate from './metaUpdate';
import pdf from './pdf';
import routes from './routes';
import scroll from './scroll';

export default function(app) {
  animate(app);
  html5Mode(app);
  http(app);
  logging(app);
  mathjax(app);
  metaUpdate(app);
  pdf(app);
  routes(app);
  scroll(app);
};
