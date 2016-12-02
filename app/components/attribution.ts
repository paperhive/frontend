const attributionTooltipUrl = require('!ngtemplate-loader?relativeTo=/app!html-loader!./attribution-tooltip.html');

export default function(app) {
  app.component('attribution', {
    bindings: {
      attributionName: '@',
      attributionUrl: '@',
      licenseName: '@',
      licenseUrl: '@',
      workName: '@',
      workUrl: '@',
    },
    controller: class AttributionCtrl {
      public templateUrl = attributionTooltipUrl;
    },
    template: require('./attribution.html'),
  });
};
