import auth from './auth';
import channel from './channel';
import channelsApi from './channelsApi';
import clipboard from './clipboard';
import distangle from './distangle';
import documentController from './document-controller';
import documentUploadModal from './document-upload-modal';
import documentsApi from './documents-api';
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
  distangle(app);
  documentController(app);
  documentUploadModal(app);
  documentsApi(app);
  featureFlags(app);
  feedbackModal(app);
  meta(app);
  notifications(app);
  peopleApi(app);
  person(app);
  scroll(app);
  websockets(app);
}
