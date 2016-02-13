'use strict';
import { clone } from 'lodash';
import socketio from 'socket.io-client';
import url from 'url';

export default function(app) {
  app.factory('websocketService', ['config', function(config) {

    class WebsocketService {
      constructor(apiUrl) {
        // parse url for socketio
        this.parsedUrl = url.parse(config.apiUrl);
        this.path = this.parsedUrl.path + '/socket.io';
      }

      getNamespaceUrl(namespace) {
        const parsedUrl = clone(this.parsedUrl);
        parsedUrl.pathname = '/documents';
        return url.format(parsedUrl);
      }

      join(namespace, room) {
        // connect to socketio endpoint
        const socket = socketio.connect(
          this.getNamespaceUrl(namespace),
          {
            path: this.path,
            // TODO: remove for allowing fallback?
            transports: ['websocket'],
          }
        );

        socket.emit('join', {id: '0xACAB'});
      }

    }

    return new WebsocketService();

  }]);
};