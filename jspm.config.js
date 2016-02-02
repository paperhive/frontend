SystemJS.config({
  packageConfigPaths: [
    "github:*/*.json",
    "npm:@*/*.json",
    "npm:*.json"
  ],
  globalEvaluationScope: false,
  transpiler: "plugin-typescript",

  map: {
    "plugin-typescript": "github:frankwallis/plugin-typescript@2.5.9"
  },

  packages: {
    "app": {},
    "github:frankwallis/plugin-typescript@2.5.9": {
      "map": {
        "typescript": "npm:typescript@1.7.5"
      }
    }
  }
});