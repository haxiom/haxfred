var irc = require('irc');

var config = {
  server: "irc.freenode.net",
  nick: 'Haxfred',
  channels: ['#haxiom']
};

var client = new irc.Client(config.server, config.nick, {
    channels: config.channels
});


client.addListener('pm', function (from, message) {
  client.say(from, "thanks for thinking of me.");
  // console.log('%s' , [from, console.dir(message)]);
});


client.addListener('join', function (channel, nick) {
  if (nick !== config.nick) {
    client.say(channel, "Hey there, " + nick + " welcome to #haxiom!");
  }
});


client.addListener('error', function(message) {
    console.log('error: ', message);
});

