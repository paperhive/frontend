import { ILocationService, IRootScopeService, IWindowService } from 'angular';

export default function(app) {
  type Flag = 'uploads' /* | 'feature1' | 'feature2' */;
  type Flags = {[k in Flag]?: boolean};

  app.service('featureFlagsService', class FeatureFlags {
    public flags: Flags = {};

    static $inject = ['$location', '$rootScope', '$window', 'authService'];
    constructor($location: ILocationService, protected $rootScope: IRootScopeService,
                $window: IWindowService, authService: any) {
      // enable feature flags from URL query string (example: ?enableFeature=uploads)
      const enableFeature = $location.search().enableFeature;
      if (enableFeature !== undefined) {
        const features = Array.isArray(enableFeature) ? enableFeature : [enableFeature];
        // set directly because this runs in $apply() context
        features.forEach(feature => this.flags[feature] = true);
      }

      // expose {enable,disable}Feature on window for testing
      $window.enableFeature = flag => this.enable(flag);
      $window.disableFeature = flag => this.disable(flag);

      $rootScope.$watch(() => authService.user, (user) => this.updateFromUser(user));
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

    protected updateFromUser(user) {
      const featureFlags = user && user.account && user.account.featureFlags as Flags;
      if (!featureFlags) return;
      Object.entries(featureFlags).forEach(([flag, enabled]) => this.flags[flag] = enabled);
    }
  });
}
