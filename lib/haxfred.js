var irc = require('irc');
var _ = require('lodash');
var util = require ('util');
var fs = require('fs');

var Commander = require('./commander');

var Haxfred = function (config) {
  this.config = config;
  this.personalRegex = new RegExp('(^' + config.nick + ')(:.*)');
  // hardcoded, bad :(
  this.channel = this.config.channels[0];
};

Haxfred.prototype.isPersonal = function (message) {
  return this.personalRegex.test(messsage);
}

Haxfred.prototype.connect = function () {
  var self = this;

  var client = new irc.Client(this.config.server, this.config.nick, {
      channels: this.config.channels
  });

  function say (message) {
    client.say(this.config.channels[0], message);
  };

  client.addListener('pm', function (from, message) {
    // this sucks, because there is no way to reply
    // checking for the output of route
    // and then piping that through client.
    // what do we do? pass say in to route?
    // register a "response" method
    // with commander?

    var response = this.route('pm', {"from": from});
    if (response) {
      say(response);
    }
  });

  client.addListener('join', function (channel, nick) {
    if (nick !== this.config.nick) {
      this.route('pm', {channel: channel, nick: nick});
    }
  });

  client.addListener('part', function (channel, nick, reason, message){
    if (nick === this.config.nick) {
      util.log("bot was disconnected");
    }
  });

  client.addListener('message' + this.config.channels[0], function (from, message){
    var output = "";

    if (this.isPersonal(message)) {
      output = this.route('pm', message);
    } else {
      output = this.route('normal', message);
    }

    if (output) {
      say(output);
    }
  });

  client.addListener('error', function(message) {
      console.log('error: ', message);
  });
};

module.exports = Haxfred;
