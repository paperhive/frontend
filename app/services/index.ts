'use strict';
import auth from './auth';
import channel from './channel';
import channelsApi from './channelsApi';
import distangle from './distangle';
import documentController from './document-controller';
import feedbackModal from './feedback-modal';
import meta from './meta';
import notifications from './notifications';
import scroll from './scroll';
import tour from './tour';
import websockets from './websockets';

export default function(app) {
  auth(app);
  channel(app);
  channelsApi(app);
  distangle(app);
  documentController(app);
  feedbackModal(app);
  meta(app);
  notifications(app);
  scroll(app);
  tour(app);
  websockets(app);
};
