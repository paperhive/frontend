module.exports = function (app) {
  require('./annotation.js')(app);
  require('./confirmed-click.js')(app);
  require('./elementSize')(app);
  require('./gravatar.js')(app);
  require('./highlights')(app);
  require('./inline-annotation.js')(app);
  require('./inline-annotation-draft.js')(app);
  require('./inline-editable.js')(app);
  require('./kramjax.js')(app);
  require('./onOutside')(app);
  require('./onTextSelect')(app);
  require('./pdf.js')(app);
  require('./subnav')(app);
  require('./validateArticleSource')(app);
  require('./validate-username')(app);
};
