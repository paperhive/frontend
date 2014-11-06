module.exports = function (app) {
  // TODO: how to configure this beast?!
  window.MathJax = {
  };

  var $ = require('jquery');
  console.log($);
  var MathJax = require('MathJax');

  MathJax.Hub.Config({
    root: 'assets/mathjax',
    skipStartupTypeset: true,
    messageStyle: "none",
    "HTML-CSS": {
      showMathMenu: false
    },
    extension: ["Safe.js"]
  });
  MathJax.Hub.Configured();
};
