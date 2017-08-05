import { PDFJS } from 'pdfjs-dist';

export default function(app) {
  PDFJS.workerSrc = 'assets/pdfjs/pdf.worker.js';

  // disable range fetch for now for fixing
  // https://github.com/paperhive/paperhive-frontend/issues/757
  PDFJS.disableRange = true;
}
