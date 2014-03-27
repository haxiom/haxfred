var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;

var Commander = require('./commander');

var Haxfred;
Haxfred = function (config) {
  Haxfred.prototype.init(config);
  this.config = config;

  console.log(Haxfred);

  // Load everything up
  this.loadAdapters(this.config.adapters);
  this.loadComponents(this.config.components);
};

Haxfred.prototype.init = function(config) {
   this.config = config;
}

Haxfred.prototype.loadAdapters = function(adapters) {
   var self = this;
   self.adapters = self.adapters || [];

   // @TODO detect if adapters is a function and execute
   // @TODO add default. Default could be to look in connectors directory

   // Normally will look at the config file for all the adapters to load
   adapters.forEach(function(adapter) {
      // Maybe should check if the adapter is already loaded
      console.log('adapter:', adapter);
      console.log('self:', self);
      self.adapters.push(require(adapter)(self)); //
   });
};

Haxfred.prototype.loadComponents = function(components) {
   var self = this;
   self.components = self.components || [];

   // @TODO detect if components is a function and execute
   // @TODO add default. Default could be to look in commands directory

   // Normally will look at the config file for all the Components to load 
   components.forEach(function(adapter) {
      // Maybe should check if the adapter is already loaded
      self.components.push(require(adapter)(self));
   });
};
      

Haxfred.prototype.out = function (output) {
  this.emit('out', output);
};

Haxfred.prototype.log = function (output) {
  console.log(output);
}

// May be useful for implementing a different router
//Haxfred.prototype.registerConnector = function (connector) {
//  connector(this);
//  return this;
//};

_.extend(Haxfred.prototype, EventEmitter.prototype);

module.exports = Haxfred;
