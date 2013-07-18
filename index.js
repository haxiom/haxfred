var irc = require('irc');
var _ = require('lodash');

var config = {
  server: "irc.freenode.net",
  nick: 'Haxfred',
  channels: ['#haxiom']
};


/* ==========================================================================
   helpers
   ========================================================================== */

/**
 * Returns a random phrase
 * @return string
 * @todo: make this a closure/object that keeps track of which responses are given,
 * making sure it doesn't give the same response in a row
 */
var randPhrase = function () {
  var phrases = [
    "The battleline between good and evil runs through the heart of every man.",
    "How can you expect a man who's warm to understand one who's cold?",
    "Nice weather, eh?",
    "<whistles yankee doodle dandee>",
    "Get your facts first, then you can distort them as you please.",
    "Only those who will risk going too far can possibly find out how far one can go.",
    "St. Aquinas was a perl monk",
    "Ruby is for hipsters",
    "Totally",
  ];

  return phrases[_.random(0, phrases.length - 1)];
}


/* Regex
=================================*/
// is bot being addressed?
var personalChat = new RegExp('(^' + config.nick + ')(:.*)');

/* ==========================================================================
   Chat
   ========================================================================== */

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


client.addListener('message' + config.channels[0], function (from, message){
  // might get a little word, but it's handy for seeing what messages actually crashed the bot
  console.log('from/to %s ', from, message);
  var groups = message.match(personalChat);

  if (groups && groups[1] === config.nick) {
    console.log('matching group: %s', groups[1]);
    // ends up in a PM pane
    client.say(config.channels[0], randPhrase());
  }
});


client.addListener('error', function(message) {
    console.log('error: ', message);
});
