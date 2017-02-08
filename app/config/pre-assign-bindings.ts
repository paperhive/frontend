export default function (app) {
  // re-enable pre-assign bindings, see
  // https://docs.angularjs.org/guide/migration#commit-bcd0d4
  // TODO: move init code to $onInit()
  app.config(['$compileProvider', $compileProvider => {
    $compileProvider.preAssignBindingsEnabled(true);
  }]);
}
