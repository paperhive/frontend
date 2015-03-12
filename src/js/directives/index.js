'use strict';
module.exports = function (app) {
  require('./comment')(app);
  require('./confirmed-click')(app);
  require('./elementSize')(app);
  require('./gravatar')(app);
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
