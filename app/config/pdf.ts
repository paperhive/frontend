import {PDFJS} from 'pdfjs-dist';

export default function(app) {
  PDFJS.workerSrc = 'assets/pdfjs/pdf.worker.js';
}