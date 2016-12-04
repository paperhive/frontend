import { clone } from 'lodash';
import { Observable } from 'rx';
import socketio from 'socket.io-client';
import url from 'url';

class WebsocketService {
  parsedUrl: url.Url;
  path: string;

  constructor(apiUrl) {
    // parse url for socketio
    this.parsedUrl = url.parse(apiUrl);

    // set socketio path
    this.path = this.parsedUrl.path;
    if (this.path[this.path.length - 1] !== '/') {
      this.path += '/';
    }
    this.path += 'socket.io';
  }

  getNamespaceUrl(namespace) {
    const parsedUrl = clone(this.parsedUrl);
    parsedUrl.pathname = '/' + namespace;
    return url.format(parsedUrl);
  }

  join(namespace, payload) {
    return Observable.create((observable) => {
      // connect to socketio endpoint
      const socket = socketio.connect(
        this.getNamespaceUrl(namespace),
        {
          path: this.path,
          // TODO: remove for allowing fallback?
          transports: ['websocket'],
        },
      );

      socket.emit('join', payload);

      socket.on('update', observable.onNext.bind(observable));

      socket.on('error', observable.onError.bind(observable));
      socket.on('reconnect_failed', observable.onError.bind(observable));
      // TODO check if the following errors are fatal
      // socket.on('reconnect_error', observable.onError.bind(observable));
      // socket.on('connect_error', observable.onError.bind(observable));

      return () => socket.close();
    });
  }
}

export default function(app) {
  app.factory('websocketService', ['config', function(config) {
    return new WebsocketService(config.apiUrl);
  }]);
};
