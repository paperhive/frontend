'use strict';
import socketio from 'socket.io-client';

export default function(app) {
  app.factory('websocketService', ['config', function(config) {

    class WebsocketService {

      constructor() {
        console.log('hi there');
        this.socket = socketio.connect(
          'https://dev.paperhive.org/documents',
          {path: '/backend/websockets/socket.io'}
        );
      }

      join(namespace, room) {
        this.socket.emit('join', {id: '0xACAB'});
      }

    }

    return new WebsocketService();

  }]);
};