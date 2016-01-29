/*global MathJax*/
'use strict';
module.exports = function(app) {
  // TODO: how to load+configure this beast via broserify/require()?!
  /*
  const MathJax = require('MathJax');
  */

  MathJax.Hub.Config({
    skipStartupTypeset: true,
    messageStyle: 'none',
    'HTML-CSS': {
      showMathMenu: false
    },
    extension: ['Safe.js']
  });
  MathJax.Hub.Configured();
};
