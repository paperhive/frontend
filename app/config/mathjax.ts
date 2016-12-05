import MathJax from 'mathjax';

export default function(app) {
  MathJax.Hub.Config({
    skipStartupTypeset: true,
    messageStyle: 'none',
    'HTML-CSS': {
      showMathMenu: false,
    },
    extensions: ['Safe.js'],
    tex2jax: {
      // just like kramed.renderer.math:
      inlineMath: [
        ['$$', '$$'],
      ],
      displayMath: [],
    },
  });
  MathJax.Hub.Configured();
}
