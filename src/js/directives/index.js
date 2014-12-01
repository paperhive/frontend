module.exports = function (app) {
  require('./annotation.js')(app);
  require('./kramjax.js')(app);
  require('./showPdf.js')(app);
};
