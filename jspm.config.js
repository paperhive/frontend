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
    "angular": "github:angular/bower-angular@1.4.9",
    "angular-animate": "github:angular/bower-angular-animate@1.4.9",
    "angular-route": "github:angular/bower-angular-route@1.4.9",
    "angular-sanitize": "github:angular/bower-angular-sanitize@1.4.9",
    "angular-ui-bootstrap": "npm:angular-ui-bootstrap@1.1.2",
    "bootstrap": "github:twbs/bootstrap@3.3.6",
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
    "github:angular/bower-angular-animate@1.4.9": {
      "map": {
        "angular": "github:angular/bower-angular@1.4.9"
      }
    },
    "github:angular/bower-angular-route@1.4.9": {
      "map": {
        "angular": "github:angular/bower-angular@1.4.9"
      }
    },
    "github:angular/bower-angular-sanitize@1.4.9": {
      "map": {
        "angular": "github:angular/bower-angular@1.4.9"
      }
    },
    "github:frankwallis/plugin-typescript@2.5.9": {
      "map": {
        "typescript": "npm:typescript@1.7.5"
      }
    },
    "github:twbs/bootstrap@3.3.6": {
      "map": {
        "jquery": "github:components/jquery@2.2.0"
      }
    }
  }
});