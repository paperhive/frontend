import jquery from 'jquery';

export default function(app) {
  app.service('clipboard', class ClipboardService {
    static $inject = ['$document'];

    constructor(public $document) {}

    copy(str: string) {
      const document = this.$document[0];

      // see http://stackoverflow.com/a/30810322/1219479
      const textarea = document.createElement('textarea');
      textarea.value = str;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
      } catch (error) {
        console.error(`Could not copy text to clipboard: ${error.message}`);
      }
      document.body.removeChild(textarea);
    }
  });
}
