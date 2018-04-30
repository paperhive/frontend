import auth from './auth';
import channel from './channel';
import channelsApi from './channelsApi';
import clipboard from './clipboard';
import confirmModal from './confirm-modal';
import distangle from './distangle';
import documentItemsApi from './document-items-api';
import documentSubscriptionsApi from './document-subscriptions-api';
import documentUploadModal from './document-upload-modal';
import featureFlags from './feature-flags';
import feedbackModal from './feedback-modal';
import meta from './meta';
import notifications from './notifications';
import peopleApi from './people-api';
import person from './person';
import scroll from './scroll';
import websockets from './websockets';

export default function(app) {
  auth(app);
  channel(app);
  channelsApi(app);
  clipboard(app);
  confirmModal(app);
  distangle(app);
  documentUploadModal(app);
  documentItemsApi(app);
  documentSubscriptionsApi(app);
  featureFlags(app);
  feedbackModal(app);
  meta(app);
  notifications(app);
  peopleApi(app);
  person(app);
  scroll(app);
  websockets(app);
}
