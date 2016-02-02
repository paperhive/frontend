SystemJS.config({
  packageConfigPaths: [
    "github:*/*.json",
    "npm:@*/*.json",
    "npm:*.json"
  ],
  globalEvaluationScope: false,
  transpiler: "plugin-babel",
  typescriptOptions: {
    "tsconfig": true,
    "typeCheck": true
  },

  map: {
    "jquery": "npm:jquery@2.2.0",
    "plugin-babel": "npm:systemjs-plugin-babel@0.0.2",
    "plugin-typescript": "github:frankwallis/plugin-typescript@2.5.9",
    "process": "github:jspm/nodelibs-process@0.2.0-alpha",
    "rangy": "github:timdown/rangy-release@1.3.0",
    "ts": "github:frankwallis/plugin-typescript@2.5.9"
  },

  packages: {
    "app": {
      "defaultExtension": "ts",
      "meta": {
        "*.ts": {
          "loader": "ts",
          "format": "esm"
        }
      }
    },
    "github:frankwallis/plugin-typescript@2.5.9": {
      "map": {
        "typescript": "npm:typescript@1.7.5"
      }
    }
  }
});