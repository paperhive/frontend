module.exports = function (app) {
  app.controller('ReplyCtrl', [function() {
    this.replies = [];

    this.replies.push(
      {user:"hoppenstedt", body:"yak yak yak"}
    );

    this.addReply = function(reply) {
      this.replies.push(reply);
      return;
    };

    this.getReplies = function() {
      return this.replies;
    };
  }]);
};
