// MathJax comes from outer space
// TODO: how to load+configure this beast via typescript?!
declare const MathJax: any;

export default function(app) {
  MathJax.Hub.Config({
    skipStartupTypeset: true,
    messageStyle: 'none',
    'HTML-CSS': {
      showMathMenu: false
    },
    extension: ['Safe.js']
  });
  MathJax.Hub.Configured();
}