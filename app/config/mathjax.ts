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
    extension: ['Safe.js'],
    tex2jax: {
      // just like kramed.renderer.math:
      inlineMath: [
        ['$$', '$$'],
      ],
      displayMath: [],
    }
  });
  MathJax.Hub.Configured();
}
