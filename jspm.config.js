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
    "angular-bootstrap": "github:angular-ui/bootstrap-bower@1.1.2",
    "angular-leaflet-directive": "github:tombatossals/angular-leaflet-directive@0.10.0",
    "angular-moment": "npm:angular-moment@1.0.0-beta.3",
    "angular-route": "github:angular/bower-angular-route@1.4.9",
    "angular-route-segment": "github:artch/angular-route-segment@1.5.0",
    "angular-sanitize": "github:angular/bower-angular-sanitize@1.4.9",
    "assert": "github:jspm/nodelibs-assert@0.2.0-alpha",
    "bootstrap": "github:twbs/bootstrap@3.3.6",
    "highlightjs": "github:components/highlightjs@9.1.0",
    "javascript-detect-element-resize": "github:sdecima/javascript-detect-element-resize@0.5.3",
    "jquery": "npm:jquery@2.2.0",
    "json": "github:systemjs/plugin-json@0.1.0",
    "kramed": "npm:kramed@0.5.5",
    "leaflet": "github:Leaflet/Leaflet@0.7.7",
    "lodash": "npm:lodash@4.2.0",
    "ment.io": "github:jeff-collins/ment.io@0.9.24",
    "ngSmoothScroll": "github:d-oliveros/ngSmoothScroll@2.0.0",
    "paperhive-sources": "npm:paperhive-sources@4.0.1",
    "pdfjs-dist": "github:mozilla/pdfjs-dist@1.4.37",
    "plugin-babel": "npm:systemjs-plugin-babel@0.0.2",
    "plugin-typescript": "github:frankwallis/plugin-typescript@2.5.9",
    "process": "github:jspm/nodelibs-process@0.2.0-alpha",
    "rangy": "github:timdown/rangy-release@1.3.0",
    "ts": "github:frankwallis/plugin-typescript@2.5.9",
    "url": "github:jspm/nodelibs-url@0.2.0-alpha"
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
    "github:jspm/nodelibs-url@0.2.0-alpha": {
      "map": {
        "url-browserify": "npm:url@0.11.0"
      }
    },
    "github:twbs/bootstrap@3.3.6": {
      "map": {
        "jquery": "github:components/jquery@2.2.0"
      }
    },
    "npm:angular-moment@1.0.0-beta.3": {
      "map": {
        "moment": "npm:moment@2.10.6"
      }
    },
    "npm:url@0.11.0": {
      "map": {
        "punycode": "npm:punycode@1.3.2",
        "querystring": "npm:querystring@0.2.0"
      }
    }
  }
});