var irc = require('irc');

var config = {
  server: "irc.freenode.net",
  nick: 'jeevesHaxiom',
  channels: ['#haxiom']
};

var client = new irc.Client(config.server, config.nick, {
    channels: config.channels
});


client.addListener('pm', function (nick, text, message) {
  client.say(nick, "thanks for thinking of me.");
});


client.addListener('join', function(channel, nick, message) {
  if (nick !== config.nick) {
    client.say(nick + ": welcome to #haxiom");
  }
});


client.addListener('error', function(message) {
    console.log('error: ', message);
});

