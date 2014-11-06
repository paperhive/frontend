module.exports = function (app) {
  // TODO: how to load+configure this beast via broserify/require()?!
  /*
  var MathJax = require('MathJax');
  */

  MathJax.Hub.Config({
    skipStartupTypeset: true,
    messageStyle: "none",
    "HTML-CSS": {
      showMathMenu: false
    },
    extension: ["Safe.js"]
  });
  MathJax.Hub.Configured();
};
