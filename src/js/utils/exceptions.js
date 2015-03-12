module.exports = function (app) {
  'use strict';

  function PhError(message) {
    this.name = 'PhError';
    this.message = message;
  }
  PhError.prototype = new Error();
  PhError.prototype.constructor = PhError;
};
