var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;

var Commander = require('./commander');

var Haxfred = function (config) {
  this.config = config;

  this.personalRegex = new RegExp('(^' + this.config.nick + ')(:.*)');
  // hardcoded, bad :(
  this.channel = this.config.channels[0];

  var commander = new Commander(['pm', 'normal', 'part']);

  this.router = commander;
};

Haxfred.prototype.out = function (output) {
  this.emit('out', output);
};

Haxfred.prototype.isPersonal = function (message) {
  return this.personalRegex.test(message);
}

Haxfred.prototype.log = function (output) {
  console.log(output);
}

Haxfred.prototype.registerConnector = function (connector) {
  connector(this);
  return this;
};

Haxfred.prototype.connect = function () {
  this.emit('connect');
  console.log('Listening');
};

_.extend(Haxfred.prototype, EventEmitter.prototype);

module.exports = Haxfred;
