var irc = require('irc');
var _ = require('lodash');
var util = require ('util');
var fs = require('fs');

/* Regex
=================================*/
// is bot being addressed?
var personalChat = new RegExp('(^' + config.nick + ')(:.*)');

var Haxfred = function (config) {
  this.config = config;
}

Haxfred.prototype.initialize = function () {
  var client = new irc.Client(config.server, config.nick, {
      channels: config.channels
  });


  client.addListener('pm', function (from, message) {
    client.say(from, "thanks for thinking of me.");
    // console.log('%s' , [from, console.dir(message)]);
  });


  client.addListener('join', function (channel, nick) {
    util.log(nick + 'joined'); //
    if (nick !== config.nick) {
      client.say(channel, "Hey there, " + nick + " welcome to #haxiom!");
    }
  });

  client.addListener('part', function (channel, nick, reason, message){
    if (nick === config.nick) {
      util.log("bot was disconnected");
    }
  });

  client.addListener('message' + config.channels[0], function (from, message){
    var say = "";
    // might get a little word, but it's handy for seeing what messages actually crashed the bot
    console.log('from/to %s ', from, message);
    var groups = message.match(personalChat);
    if(hasLink(message)) {
      say = logThis(from, message);
    } else if (groups && groups[1] === config.nick) {
      console.log('matching group: %s', groups[1]);
      say = randPhrase();
    }
    client.say(config.channels[0], say);
    lastSaid(say);
  });


  client.addListener('error', function(message) {
      console.log('error: ', message);
  });
}
});


module.exports = function () {

