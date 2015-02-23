module.exports = function (app) {
  require('./annotation.js')(app);
  require('./confirmed-click.js')(app);
  require('./inline-annotation.js')(app);
  require('./kramjax.js')(app);
  require('./showPdf.js')(app);
  require('./subnav')(app);
  require('./validate-username')(app);
};
