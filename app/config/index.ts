'use strict';

import animate from './animate';
import html5Mode from './html5Mode';
import metaUpdate from './metaUpdate';
import pdf from './pdf';
import routes from './routes';
import scroll from './scroll';

export default function(app) {
  animate(app);
  html5Mode(app);
  metaUpdate(app);
  pdf(app);
  routes(app);
  scroll(app);
};