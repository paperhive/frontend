module.exports = function (app) {
  require('./annotation')(app);
  require('./confirmed-clicks')(app);
  require('./elementSize')(app);
  require('./gravatars')(app);
  require('./highlights')(app);
  require('./marginDiscussion')(app);
  require('./marginDiscussionDraft')(app);
  require('./inline-editable')(app);
  require('./kramjax')(app);
  require('./onOutside')(app);
  require('./onTextSelect')(app);
  require('./pdf')(app);
  require('./subnav')(app);
  require('./validateArticleSource')(app);
  require('./validate-username')(app);
};
