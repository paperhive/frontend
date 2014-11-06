module.exports = function (app) {
  require('./kramjax.js')(app);
  require('./showPdf.js')(app);
};
