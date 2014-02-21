var irc = require('irc');
var _ = require('lodash');
var util = require ('util');
var fs = require('fs');

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
 * An attempt has been made to prevent the same response being given twice in a row, but we will see how it pans out.
 * @return string
 * @todo store responses in a JSON file/feed ?
 */


// Get what Haxfred last said
 
var lastSaid = function(message) {
	fs.readFile("./extras/lastsaid", 'utf8', function (err, data) {
		if (err) throw err;
		fs.writeFile ("./extras/lastsaid", message, function(err) {
			if (err) throw err;
			
		})
	})
} 

// function to add links to top of page
 
var prependData = function(savPath, srcPath, addThis) {
	var oldFile = "";
	var newFile = "";
  fs.readFile(srcPath, 'utf8', function (err, data) {
          if (err) throw err;
					oldFile = data;
					newFile = addThis + "\n\n" + data;
          //Do your processing, MD5, send a satellite to the moon, etc.
          fs.writeFile (savPath, newFile, function(err) {
              if (err) throw err;
              
          });
      });
} 

// function to get current date and time 
var getDate = function() {
	var d = new Date();
	var month = d.getMonth() + 1;
	var day = d.getDate();
	var year = d.getFullYear();
	var hour = d.getHours();
	var ampm = "am";
	if (hour > 12) {
		hour = hour - 12;
		ampm = "pm";
	}

	var minute = d.getMinutes();
	if (minute < 10) {
		minute = "0" + minute;
	}
	var output = day + "/" + month + "/" + year + " at " + hour + ":" + minute + ampm;
  return output;  
}

var hasLink = function(message) {	
	if(message.indexOf("http://") > -1 || message.indexOf("https://") > -1) {
		return true;
	} 
	return false;
}
 
//function for Haxfred to log links to haxfred.hax10m.com
var logThis = function(from, message) {
	// Pull out link from message
	message = message.trim();
	var startLink = message.indexOf("http://");
	var onlyLink = false;
	if (startLink == -1) {
		startLink = message.indexOf("https://");
	}
	var endLink = message.indexOf(" ", startLink);
	var link = "";
	if(endLink == -1) {
		link = message.substring(startLink);
		if(startLink == 0) {
			onlyLink = true;
		}
	} else {
		link = message.substring(startLink, endLink);
	}
	
	// If message starts before or (but not and) after link, remove link
	var eMessage = message;
	if (onlyLink) {
		eMessage = "";
	} else if (startLink == 0) {
		eMessage = message.substring(endLink + 1).trim();
	} else if (link.length == (message.length - message.indexOf(link))) {
		eMessage = message.substring(startLink, endLink).trim();
	}
	
	
	// Determine what kind of link it is	
	var linkType = "";

	if(link.toLowerCase().indexOf(".gif") > -1 || link.toLowerCase().indexOf(".png") > -1 || link.toLowerCase().indexOf(".jpg") > -1 || link.toLowerCase().indexOf(".jpeg") > -1) {
		linkType = "image";
	} else if (link.toLowerCase().substring(0, 23) == "https://www.youtube.com" || link.toLowerCase().substring(0, 22) == "http://www.youtube.com" || link.toLowerCase().substring(0, 15) == "http://youtu.be" || link.toLowerCase().substring(0, 16) == "https://youtu.be") {
		linkType = "YouTube";
	} else if (link.toLowerCase().substring(0, 17) == "https://vimeo.com" || link.toLowerCase().substring(0, 16) == "http://vimeo.com") {
		
		linkType = "Vimeo";
	} else {
		
		linkType = "article";
	}
	
	
	//Format how it posts the link
	var postThis = "";
	var embedLink = "";
	var partialLink = "";
	if(linkType == "image") {
		embedLink = "<img src='" + link + "'>";
	} else if (linkType == "YouTube") {
		if(link.indexOf("https://") > -1) {
			partialLink = link.substring(32);	
			
		} else {
			partialLink = link.substring(31);	
			
		}
		embedLink = '<iframe width="560" height="315" src="//www.youtube.com/embed/' + partialLink + '" frameborder="0" allowfullscreen></iframe>';
	} else if (linkType == "Vimeo") {
		if(link.indexOf("https://") > -1) {
			partialLink = link.substring(18);	
			
		} else {
			partialLink = link.substring(17);	
			
		}
		embedLink = '<iframe src="//player.vimeo.com/video/' + partialLink + '?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;color=ffffff" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
	} else if (linkType == "article") {
		embedLink = "<a class='article' href ='" + link + "' target='_blank'>" + link + "</a>";
	} else {
		embedLink = "<a class='article' href ='" + link + "' target='_blank'>" + link + "</a>";
	}
	
	if(onlyLink) {
		printThis = "<div class='irc-link'><div class='post-body'>" + embedLink + "</div><div class='postMessage'>" + from + "</div><div class='when'>Posted on " + getDate() + "</div></div>";
	} else {
		printThis = "<div class='irc-link'><div class='post-body'>" + embedLink + "</div><div class='postMessage'>" + from + ": \"" + eMessage + "\"</div><div class='when'>Posted on " + getDate() + "</div></div>";
	}
	
	prependData("./extras/loglinks", "./extras/loglinks", printThis);
	if(linkType == "YouTube" || linkType == "Vimeo") {
		linkType = linkType + " video";	
	}
	
	return "Your " + linkType + " was logged to http://haxfred.hax10m.com";
} 
 
var randPhrase = (function () {
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

  function getRandom() {
    rand = _.random(0, phrases.length -3); // last one is always left out. not sure if this is a huge drawback or not
    var phrase = phrases[rand];
    phrases.push(phrases.splice(rand,1)[0]);
    return phrase;
  }
  return getRandom;
}());


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
