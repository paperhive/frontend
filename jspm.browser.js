SystemJS.config({
  baseURL: "/",
  paths: {
    "app/": "app/",
    "github:": "jspm_packages/github/",
    "npm:": "jspm_packages/npm/"
  },
  meta: {
    "*": {
      "scriptLoad": false
    }
  }
});
