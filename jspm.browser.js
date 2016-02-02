SystemJS.config({
  baseURL: "/",
  paths: {
    "github:*": "jspm_packages/github/*",
    "app/": "src/",
    "npm:*": "jspm_packages/npm/*"
  }
});