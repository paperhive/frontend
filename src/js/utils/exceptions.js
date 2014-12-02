module.exports = function (app) {
  function PhError(message) {
    this.name = 'PhError';
    this.message = message;
  }
  PhError.prototype = new Error();
  PhError.prototype.constructor = PhError;
};
