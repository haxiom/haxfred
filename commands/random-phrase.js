var _ = require('lodash');

/**
 * Returns a random phrase
 * An attempt has been made to prevent the same response being given twice in a row, but we will see how it pans out.
 * @return string
 * @todo store responses in a JSON file/feed ?
 */

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

function getRandom() {
  rand = _.random(0, phrases.length -3); // last one is always left out. not sure if this is a huge drawback or not
  var phrase = phrases[rand];
  phrases.push(phrases.splice(rand,1)[0]);
  return phrase;
}

module.exports = function (haxfred) {
  haxfred.register('pm', function () {
    return getRandom();
  })
}
