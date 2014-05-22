var irc = require('irc');

module.exports = function (bot) {
   var client = new irc.Client(bot.config.server, bot.config.nick || bot.config.nicks[0], {
      channels: bot.config.channels
   });

   // Personal stuff
   bot.personalRegex = new RegExp('(^' + bot.config.nick + ')(:.*)');
   function isPersonal(message) {
      return bot.personalRegex.test(message);
   }

   function say (message) {
      client.say(bot.config.channels[0], message);
   };

   client.addListener('pm', function (from, message) {
      bot.emit('pm', {
         from: from,
         message: message
      });
      bot.log('emitting pm');
   });

 client.addListener('join', function (channel, nick) {
   if (!bot.isPersonal(nick)) {
     output = bot.router.route('pm', {channel: channel, nick: nick});
   }
 });

 client.addListener('part', function (channel, nick, reason, message){
   if (bot.isPersonal(nick)) {
     bot.log("bot was disconnected");
   }
 });

 client.addListener('message' + bot.config.channels[0], function (from, message){
   var output = "";

   if (bot.isPersonal(message)) {
     bot.emit('pm', message);
   } else {
     bot.emit('normal', message);
   }
 });

 client.addListener('error', function(message) {
     bot.log('error: ' + message);
 });
}
