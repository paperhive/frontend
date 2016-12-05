export default function(app) {
    app.component('hiveButton', {
      bindings: {
        documentCtrl: '<',
        large: '<',
      },
      controller: class HiveButtonCtrl {
        documentCtrl: any;
        large: boolean;

        submitting = false;

        static $inject = ['authService'];
        constructor(public authService) {}

        hive() {
          this.submitting = true;
          this.documentCtrl.hive().then(() => this.submitting = false);
        }

        unhive() {
          this.submitting = true;
          this.documentCtrl.unhive().then(() => this.submitting = false);
        }
      },
      template: require('./hive-button.html'),
    });
};
