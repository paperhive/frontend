SystemJS.config({
  devConfig: {
    "map": {
      "plugin-babel": "npm:systemjs-plugin-babel@0.0.12",
      "text": "github:systemjs/plugin-text@0.0.8",
      "json": "github:systemjs/plugin-json@0.1.2",
      "ts": "github:frankwallis/plugin-typescript@4.0.16"
    },
    "packages": {
      "github:frankwallis/plugin-typescript@4.0.16": {
        "map": {
          "typescript": "npm:typescript@1.8.10"
        }
      }
    }
  },
  transpiler: "plugin-babel",
  typescriptOptions: {
    "tsconfig": true,
    "typeCheck": false
  },
  meta: {
    'config.json': {
      format: 'json',
      loader: 'json'
    }
  },
  packages: {
    "app": {
      "defaultExtension": "ts",
      "meta": {
        "*.ts": {
          "loader": "ts",
          "format": "esm"
        },
        "*.json": {
          "loader": "json"
        },
        "*.html": {
          "loader": "text"
        }
      }
    }
  }
});

SystemJS.config({
  packageConfigPaths: [
    "github:*/*.json",
    "npm:@*/*.json",
    "npm:*.json"
  ],
  map: {
    "Leaflet/Leaflet": "github:Leaflet/Leaflet@0.7.7",
    "angular": "github:angular/bower-angular@1.5.7",
    "angular-animate": "github:angular/bower-angular-animate@1.5.7",
    "angular-bootstrap": "github:angular-ui/bootstrap-bower@1.3.3",
    "angular-leaflet-directive": "github:tombatossals/angular-leaflet-directive@0.10.0",
    "angular-moment": "npm:angular-moment@1.0.0-beta.6",
    "angular-route": "github:angular/bower-angular-route@1.5.7",
    "angular-route-segment": "npm:angular-route-segment@1.5.1",
    "angular-sanitize": "github:angular/bower-angular-sanitize@1.5.7",
    "angulartics": "npm:angulartics@1.1.2",
    "angulartics-google-analytics": "npm:angulartics-google-analytics@0.2.0",
    "assert": "github:jspm/nodelibs-assert@0.2.0-alpha",
    "async": "npm:async@2.0.0-rc.6",
    "buffer": "github:jspm/nodelibs-buffer@0.2.0-alpha",
    "components/highlightjs": "github:components/highlightjs@9.4.0",
    "core-js": "npm:core-js@2.4.0",
    "d-oliveros/ngSmoothScroll": "github:d-oliveros/ngSmoothScroll@2.0.0",
    "dentist": "npm:dentist@1.0.3",
    "fs": "github:jspm/nodelibs-fs@0.2.0-alpha",
    "highlightjs": "github:components/highlightjs@9.6.0",
    "javascript-detect-element-resize": "github:sdecima/javascript-detect-element-resize@0.5.3",
    "jquery": "npm:jquery@2.2.4",
    "kramed": "npm:kramed@0.5.6",
    "leaflet": "github:Leaflet/Leaflet@0.7.7",
    "lodash": "npm:lodash@4.13.1",
    "ngSmoothScroll": "github:d-oliveros/ngSmoothScroll@2.0.0",
    "os": "github:jspm/nodelibs-os@0.2.0-alpha",
    "paperhive-sources": "npm:paperhive-sources@4.0.2",
    "path": "github:jspm/nodelibs-path@0.2.0-alpha",
    "pdfjs-dist": "github:mozilla/pdfjs-dist@1.5.389",
    "process": "github:jspm/nodelibs-process@0.2.0-alpha",
    "rangy": "github:timdown/rangy-release@1.3.0",
    "readline": "github:jspm/nodelibs-readline@0.2.0-alpha",
    "rx": "npm:rx@4.1.0",
    "socket.io-client": "github:socketio/socket.io-client@1.4.8",
    "url": "github:jspm/nodelibs-url@0.2.0-alpha"
  },
  packages: {
    "github:jspm/nodelibs-buffer@0.2.0-alpha": {
      "map": {
        "buffer-browserify": "npm:buffer@4.7.0"
      }
    },
    "github:jspm/nodelibs-os@0.2.0-alpha": {
      "map": {
        "os-browserify": "npm:os-browserify@0.2.1"
      }
    },
    "github:jspm/nodelibs-url@0.2.0-alpha": {
      "map": {
        "url-browserify": "npm:url@0.11.0"
      }
    },
    "github:sdecima/javascript-detect-element-resize@0.5.3": {
      "map": {
        "jquery": "npm:jquery@2.2.4"
      }
    },
    "github:tombatossals/angular-leaflet-directive@0.10.0": {
      "map": {
        "leaflet": "github:Leaflet/Leaflet@0.7.7"
      }
    },
    "npm:angular-moment@1.0.0-beta.6": {
      "map": {
        "moment": "npm:moment@2.14.1"
      }
    },
    "npm:url@0.11.0": {
      "map": {
        "punycode": "npm:punycode@1.3.2",
        "querystring": "npm:querystring@0.2.0"
      }
    },
    "npm:async@2.0.0-rc.6": {
      "map": {
        "lodash": "npm:lodash@4.13.1"
      }
    },
    "npm:buffer@4.7.0": {
      "map": {
        "base64-js": "npm:base64-js@1.1.2",
        "ieee754": "npm:ieee754@1.1.6",
        "isarray": "npm:isarray@1.0.0"
      }
    },
    "github:angular/bower-angular-sanitize@1.5.7": {
      "map": {
        "angular": "github:angular/bower-angular@1.5.7"
      }
    },
    "github:angular/bower-angular-route@1.5.7": {
      "map": {
        "angular": "github:angular/bower-angular@1.5.7"
      }
    },
    "github:angular/bower-angular-animate@1.5.7": {
      "map": {
        "angular": "github:angular/bower-angular@1.5.7"
      }
    },
    "github:Leaflet/Leaflet@0.7.7": {
      "map": {
        "css": "github:systemjs/plugin-css@0.1.23"
      }
    }
  }
});
