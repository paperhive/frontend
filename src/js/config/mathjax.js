module.exports = function (app) {
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
