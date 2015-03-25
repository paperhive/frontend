'use strict';
module.exports = function(app) {
  require('./article.js')(app);
  require('./articleText.js')(app);
  require('./articleNew.js')(app);
  require('./comment')(app);
  require('./discussion.js')(app);
  require('./help.js')(app);
  require('./navbar.js')(app);
  require('./navbarSearch.js')(app);
  require('./navbar_user.js')(app);
  require('./notifications.js')(app);
  require('./oauthOrcid.js')(app);
  require('./settings.js')(app);
  require('./sidenav.js')(app);
  require('./user.js')(app);
  require('./userArticles.js')(app);
  require('./welcome.js')(app);
};
