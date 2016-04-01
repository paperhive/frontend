'use strict';
import auth from './auth';
import distangle from './distangle';
import meta from './meta';
import notifications from './notifications';
import tour from './tour';
import websockets from './websockets';

export default function(app) {
  auth(app);
  distangle(app);
  meta(app);
  notifications(app);
  tour(app);
  websockets(app);
};
