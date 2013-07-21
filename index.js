var irc = require('irc');
var _ = require('lodash');
var util = require ('util');

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
 * @todo make this a closure/object that keeps track of which responses are given,
 * @todo store responses in a JSON file/feed ?
 * making sure it doesn't give the same response in a row
 */
var randPhrase = function () {
  //@todo make these contextual? (as in, if there is a '?' at the end of a prompted message, dispatch 'answers to questions')
  // use a "hash": responses{ '?': ['yes, I think so', 'no way man'], '!' ["i'm excited too"] }
  var phrases = [
    // Aleksandr Solzhenitsyn
    "The battleline between good and evil runs through the heart of every man.",
    "How can you expect a man who's warm to understand one who's cold?",
    // haxiom
    "Nice weather, eh?",
    "<whistles yankee doodle dandee>",
    "Get your facts first, then you can distort them as you please.",
    "Only those who will risk going too far can possibly find out how far one can go.",
    "St. Aquinas was a perl monk",
    "Ruby is for hipsters",
    "Totally",
    // richard stallman
   "I see nothing unethical in the job it does. Why shouldn't you send a copy of some music to a friend?",
   "I'm always happy when I'm protesting.",
   "'Free software' is a matter of liberty, not price. To understand the concept, you should think of 'free' as in 'free speech,' not as in 'free beer'.",
   "For personal reasons, I do not browse the web from my computer. (I also have not net connection much of the time.) To look at page I send mail to a demon which runs wget and mails the page back to me. It is very efficient use of my time, but it is slow in real time.",
   "Playfully doing something difficult, whether useful or not, that is hacking.",
   "Copying all or parts of a program is as natural to a programmer as breathing, and as productive. It ought to be as free." ,
   // john lennon
   "All you need is love."
  ];

  var randPhrase = (function () {
  function getRandom() {

    rand = _.random(0, nums.length -3); // last one is always left out. not sure if this is a huge drawback or not
    var phrase = phrases[rand];
    phrases.push(phrases.splice(rand,1)[0]);
    return phrase;
  }
  return getRandom;
}());
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
  // might get a little word, but it's handy for seeing what messages actually crashed the bot
  console.log('from/to %s ', from, message);
  var groups = message.match(personalChat);

  if (groups && groups[1] === config.nick) {
    console.log('matching group: %s', groups[1]);
    client.say(config.channels[0], randPhrase());
  }
});


client.addListener('error', function(message) {
    console.log('error: ', message);
});
