'use strict';
var PDFJS = require('pdfjs');
module.exports = function (app) {
  PDFJS.workerSrc = 'assets/pdfjs/pdf.worker.js';
};
