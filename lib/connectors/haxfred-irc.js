var irc = require('irc');

module.exports = function (bot) {
  function initialize () {
    var client = new irc.Client(bot.config.server, bot.config.nick, {
        channels: bot.config.channels
    });

    function say (message) {
      client.say(bot.config.channels[0], message);
    };

    client.addListener('pm', function (from, message) {
      // this sucks, because there is no way to reply
      // checking for the output of route
      // and then piping that through client.
      // what do we do? pass say in to route?
      // register a "response" method
      // with commander?

      var response = bot.route('pm', {"from": from});
      if (response) {
        say(response);
      }
    });

    client.addListener('join', function (channel, nick) {
      var output;

      if (!bot.isPersonal(nick)) {
        output = bot.route('pm', {channel: channel, nick: nick});
      }

      if (output) say(output);
    });

    client.addListener('part', function (channel, nick, reason, message){
      if (bot.isPersonal(nick)) {
        bot.log("bot was disconnected");
      }
    });

    client.addListener('message' + bot.config.channels[0], function (from, message){
      var output = "";

      if (bot.isPersonal(message)) {
        output = bot.route('pm', message);
      } else {
        output = bot.route('normal', message);
      }

      if (output) say(output);
    });

    client.addListener('error', function(message) {
        bot.log('error: ' + message);
    });
  }

  bot.on('connect', initialize);
}
