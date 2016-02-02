// import pdfjs from 'pdfjs';

const pdfjs = require('pdfjs');
export default function(app) {
  pdfjs.workerSrc = 'assets/pdfjs/pdf.worker.js';
}