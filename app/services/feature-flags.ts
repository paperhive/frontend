import { IRootScopeService } from 'angular';

export default function(app) {
  type Flag = 'uploads' /* | 'feature1' | 'feature2' */;

  app.service('featureFlagsService', class FeatureFlags {
    public flags: {[k in Flag]?: boolean} = {};

    static $inject = ['$rootScope', '$window'];
    constructor(protected $rootScope: IRootScopeService, $window) {
      // expose {enable,disable}Feature on window for testing
      $window.enableFeature = flag => this.enable(flag);
      $window.disableFeature = flag => this.disable(flag);
    }

    public disable(flag: Flag) {
      this.set(flag, false);
    }

    public enable(flag: Flag) {
      this.set(flag, true);
    }

    public isEnabled(flag: Flag) {
      return this.flags[flag] === true;
    }

    public set(flag: Flag, enabled: boolean) {
      this.$rootScope.$apply(() => this.flags[flag] = enabled);
    }
  });
}
