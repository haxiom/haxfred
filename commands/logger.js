var lastSaid = module.exports.lastsaid = function(message) {
	fs.readFile("./extras/lastsaid", 'utf8', function (err, data) {
		if (err) throw err;
		fs.writeFile ("./extras/lastsaid", message, function(err) {
			if (err) throw err;

		});
	});
};

// function to add links to top of page

var prependData = module.exports.prependData = function(savPath, srcPath, addThis) {
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
};

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
	if(message.indexOf("https://gist.github.com") > -1 || message.indexOf("http://gist.github.com") > -1 || message.indexOf("http://haxfred.hax10m.com") > -1) {
		return false;
	} else if(message.indexOf("http://") > -1 || message.indexOf("https://") > -1) {
		return true;
	}
	return false;
};

//function for Haxfred to log links to haxfred.hax10m.com
var logThis = module.exports.logThis = function(from, message) {
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
};
