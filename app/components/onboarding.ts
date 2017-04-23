require('./onboarding.less');

export default function(app) {
  app.component('onboarding', {template: require('./onboarding.html')});
};
