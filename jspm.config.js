SystemJS.config({
  devConfig: {
    "map": {
      "text": "github:systemjs/plugin-text@0.0.8",
      "json": "github:systemjs/plugin-json@0.1.2",
      "ts": "github:frankwallis/plugin-typescript@5.2.7",
      "plugin-babel": "npm:systemjs-plugin-babel@0.0.15",
      "http": "npm:jspm-nodelibs-http@0.2.0",
      "net": "npm:jspm-nodelibs-net@0.2.0"
    },
    "packages": {
      "github:frankwallis/plugin-typescript@5.2.7": {
        "map": {
          "typescript": "npm:typescript@2.0.6"
        }
      },
      "npm:jspm-nodelibs-http@0.2.0": {
        "map": {
          "http-browserify": "npm:stream-http@2.4.0"
        }
      },
      "npm:stream-http@2.4.0": {
        "map": {
          "inherits": "npm:inherits@2.0.3",
          "xtend": "npm:xtend@4.0.1",
          "to-arraybuffer": "npm:to-arraybuffer@1.0.1",
          "builtin-status-codes": "npm:builtin-status-codes@2.0.0",
          "readable-stream": "npm:readable-stream@2.1.5"
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
    "config.json": {
      "format": "json",
      "loader": "json"
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
    "angular": "github:angular/bower-angular@1.5.8",
    "angular-animate": "github:angular/bower-angular-animate@1.5.8",
    "angular-bootstrap": "github:angular-ui/bootstrap-bower@2.1.4",
    "angular-leaflet-directive": "github:tombatossals/angular-leaflet-directive@0.10.0",
    "angular-moment": "npm:angular-moment@1.0.0-beta.6",
    "angular-route": "github:angular/bower-angular-route@1.5.8",
    "angular-route-segment": "npm:angular-route-segment@1.5.1",
    "angular-sanitize": "github:angular/bower-angular-sanitize@1.5.8",
    "angulartics": "npm:angulartics@1.1.3",
    "angulartics-google-analytics": "npm:angulartics-google-analytics@0.2.1",
    "assert": "npm:jspm-nodelibs-assert@0.2.0",
    "async": "npm:async@2.0.1",
    "buffer": "npm:jspm-nodelibs-buffer@0.2.0",
    "child_process": "npm:jspm-nodelibs-child_process@0.2.0",
    "components/highlightjs": "github:components/highlightjs@9.6.0",
    "constants": "npm:jspm-nodelibs-constants@0.2.0",
    "core-js": "npm:core-js@2.4.1",
    "crypto": "npm:jspm-nodelibs-crypto@0.2.0",
    "dentist": "npm:dentist@1.0.3",
    "events": "npm:jspm-nodelibs-events@0.2.0",
    "fs": "npm:jspm-nodelibs-fs@0.2.0",
    "highlightjs": "github:components/highlightjs@9.6.0",
    "javascript-detect-element-resize": "github:sdecima/javascript-detect-element-resize@0.5.3",
    "jquery": "npm:jquery@3.1.0",
    "kramed": "npm:kramed@0.5.6",
    "leaflet": "github:Leaflet/Leaflet@0.7.7",
    "lodash": "npm:lodash@4.15.0",
    "mozilla/pdfjs-dist": "github:mozilla/pdfjs-dist@1.5.415",
    "os": "npm:jspm-nodelibs-os@0.2.0",
    "paperhive-sources": "npm:paperhive-sources@4.0.2",
    "path": "npm:jspm-nodelibs-path@0.2.0",
    "pdfjs-dist": "github:mozilla/pdfjs-dist@1.5.415",
    "process": "github:jspm/nodelibs-process@0.2.0-alpha",
    "rangy": "github:timdown/rangy-release@1.3.0",
    "readline": "npm:jspm-nodelibs-readline@0.2.0",
    "rx": "npm:rx@4.1.0",
    "socket.io-client": "github:socketio/socket.io-client@1.4.8",
    "stream": "npm:jspm-nodelibs-stream@0.2.0",
    "string_decoder": "npm:jspm-nodelibs-string_decoder@0.2.0",
    "url": "npm:jspm-nodelibs-url@0.2.0",
    "util": "npm:jspm-nodelibs-util@0.2.0",
    "vm": "npm:jspm-nodelibs-vm@0.2.0"
  },
  packages: {
    "github:sdecima/javascript-detect-element-resize@0.5.3": {
      "map": {
        "jquery": "npm:jquery@3.1.0"
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
    "github:Leaflet/Leaflet@0.7.7": {
      "map": {
        "css": "github:systemjs/plugin-css@0.1.27"
      }
    },
    "npm:async@2.0.1": {
      "map": {
        "lodash": "npm:lodash@4.15.0"
      }
    },
    "npm:buffer@4.9.1": {
      "map": {
        "isarray": "npm:isarray@1.0.0",
        "base64-js": "npm:base64-js@1.2.0",
        "ieee754": "npm:ieee754@1.1.8"
      }
    },
    "github:angular/bower-angular-sanitize@1.5.8": {
      "map": {
        "angular": "github:angular/bower-angular@1.5.8"
      }
    },
    "github:angular/bower-angular-animate@1.5.8": {
      "map": {
        "angular": "github:angular/bower-angular@1.5.8"
      }
    },
    "github:angular/bower-angular-route@1.5.8": {
      "map": {
        "angular": "github:angular/bower-angular@1.5.8"
      }
    },
    "npm:crypto-browserify@3.11.0": {
      "map": {
        "browserify-cipher": "npm:browserify-cipher@1.0.0",
        "browserify-sign": "npm:browserify-sign@4.0.0",
        "create-hash": "npm:create-hash@1.1.2",
        "create-hmac": "npm:create-hmac@1.1.4",
        "create-ecdh": "npm:create-ecdh@4.0.0",
        "pbkdf2": "npm:pbkdf2@3.0.9",
        "randombytes": "npm:randombytes@2.0.3",
        "public-encrypt": "npm:public-encrypt@4.0.0",
        "inherits": "npm:inherits@2.0.3",
        "diffie-hellman": "npm:diffie-hellman@5.0.2"
      }
    },
    "npm:browserify-sign@4.0.0": {
      "map": {
        "create-hash": "npm:create-hash@1.1.2",
        "create-hmac": "npm:create-hmac@1.1.4",
        "inherits": "npm:inherits@2.0.3",
        "browserify-rsa": "npm:browserify-rsa@4.0.1",
        "parse-asn1": "npm:parse-asn1@5.0.0",
        "elliptic": "npm:elliptic@6.3.2",
        "bn.js": "npm:bn.js@4.11.6"
      }
    },
    "npm:create-hash@1.1.2": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "cipher-base": "npm:cipher-base@1.0.3",
        "ripemd160": "npm:ripemd160@1.0.1",
        "sha.js": "npm:sha.js@2.4.5"
      }
    },
    "npm:create-hmac@1.1.4": {
      "map": {
        "create-hash": "npm:create-hash@1.1.2",
        "inherits": "npm:inherits@2.0.3"
      }
    },
    "npm:public-encrypt@4.0.0": {
      "map": {
        "create-hash": "npm:create-hash@1.1.2",
        "randombytes": "npm:randombytes@2.0.3",
        "browserify-rsa": "npm:browserify-rsa@4.0.1",
        "parse-asn1": "npm:parse-asn1@5.0.0",
        "bn.js": "npm:bn.js@4.11.6"
      }
    },
    "npm:diffie-hellman@5.0.2": {
      "map": {
        "randombytes": "npm:randombytes@2.0.3",
        "bn.js": "npm:bn.js@4.11.6",
        "miller-rabin": "npm:miller-rabin@4.0.0"
      }
    },
    "npm:browserify-cipher@1.0.0": {
      "map": {
        "evp_bytestokey": "npm:evp_bytestokey@1.0.0",
        "browserify-des": "npm:browserify-des@1.0.0",
        "browserify-aes": "npm:browserify-aes@1.0.6"
      }
    },
    "npm:evp_bytestokey@1.0.0": {
      "map": {
        "create-hash": "npm:create-hash@1.1.2"
      }
    },
    "npm:browserify-rsa@4.0.1": {
      "map": {
        "randombytes": "npm:randombytes@2.0.3",
        "bn.js": "npm:bn.js@4.11.6"
      }
    },
    "npm:browserify-des@1.0.0": {
      "map": {
        "cipher-base": "npm:cipher-base@1.0.3",
        "inherits": "npm:inherits@2.0.3",
        "des.js": "npm:des.js@1.0.0"
      }
    },
    "npm:parse-asn1@5.0.0": {
      "map": {
        "browserify-aes": "npm:browserify-aes@1.0.6",
        "create-hash": "npm:create-hash@1.1.2",
        "evp_bytestokey": "npm:evp_bytestokey@1.0.0",
        "pbkdf2": "npm:pbkdf2@3.0.9",
        "asn1.js": "npm:asn1.js@4.8.1"
      }
    },
    "npm:browserify-aes@1.0.6": {
      "map": {
        "cipher-base": "npm:cipher-base@1.0.3",
        "create-hash": "npm:create-hash@1.1.2",
        "evp_bytestokey": "npm:evp_bytestokey@1.0.0",
        "inherits": "npm:inherits@2.0.3",
        "buffer-xor": "npm:buffer-xor@1.0.3"
      }
    },
    "npm:create-ecdh@4.0.0": {
      "map": {
        "elliptic": "npm:elliptic@6.3.2",
        "bn.js": "npm:bn.js@4.11.6"
      }
    },
    "npm:sha.js@2.4.5": {
      "map": {
        "inherits": "npm:inherits@2.0.3"
      }
    },
    "npm:miller-rabin@4.0.0": {
      "map": {
        "bn.js": "npm:bn.js@4.11.6",
        "brorand": "npm:brorand@1.0.6"
      }
    },
    "npm:des.js@1.0.0": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
      }
    },
    "npm:hash.js@1.0.3": {
      "map": {
        "inherits": "npm:inherits@2.0.3"
      }
    },
    "npm:stream-browserify@2.0.1": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "readable-stream": "npm:readable-stream@2.1.5"
      }
    },
    "npm:readable-stream@2.1.5": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "isarray": "npm:isarray@1.0.0",
        "string_decoder": "npm:string_decoder@0.10.31",
        "core-util-is": "npm:core-util-is@1.0.2",
        "process-nextick-args": "npm:process-nextick-args@1.0.7",
        "buffer-shims": "npm:buffer-shims@1.0.0",
        "util-deprecate": "npm:util-deprecate@1.0.2"
      }
    },
    "npm:elliptic@6.3.2": {
      "map": {
        "inherits": "npm:inherits@2.0.3",
        "bn.js": "npm:bn.js@4.11.6",
        "hash.js": "npm:hash.js@1.0.3",
        "brorand": "npm:brorand@1.0.6"
      }
    },
    "npm:cipher-base@1.0.3": {
      "map": {
        "inherits": "npm:inherits@2.0.3"
      }
    },
    "npm:asn1.js@4.8.1": {
      "map": {
        "bn.js": "npm:bn.js@4.11.6",
        "inherits": "npm:inherits@2.0.3",
        "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
      }
    },
    "npm:jspm-nodelibs-buffer@0.2.0": {
      "map": {
        "buffer-browserify": "npm:buffer@4.9.1"
      }
    },
    "npm:jspm-nodelibs-crypto@0.2.0": {
      "map": {
        "crypto-browserify": "npm:crypto-browserify@3.11.0"
      }
    },
    "npm:jspm-nodelibs-os@0.2.0": {
      "map": {
        "os-browserify": "npm:os-browserify@0.2.1"
      }
    },
    "npm:jspm-nodelibs-stream@0.2.0": {
      "map": {
        "stream-browserify": "npm:stream-browserify@2.0.1"
      }
    },
    "npm:jspm-nodelibs-url@0.2.0": {
      "map": {
        "url-browserify": "npm:url@0.11.0"
      }
    },
    "npm:jspm-nodelibs-string_decoder@0.2.0": {
      "map": {
        "string_decoder-browserify": "npm:string_decoder@0.10.31"
      }
    },
    "npm:pbkdf2@3.0.9": {
      "map": {
        "create-hmac": "npm:create-hmac@1.1.4"
      }
    }
  }
});
