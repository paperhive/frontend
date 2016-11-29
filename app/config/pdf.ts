const pdfjs = require('pdfjs-dist');

export default function(app) {
  pdfjs.workerSrc = 'assets/pdfjs/pdf.worker.js';
}
