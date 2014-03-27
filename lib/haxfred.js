var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;

this.eventEmitter = new EventEmitter();

var Haxfred = function (config) {
  this.config = config;

  // Load everything up
  this.loadAdapters(this.config.adapters);
  this.loadComponents(this.config.components);
};

Haxfred.prototype.loadAdapters = function(adapters) {
   var self = this;
   self.adapters = self.adapters || [];

   // @TODO detect if adapters is a function and execute
   // @TODO add default. Default could be to look in connectors directory

   // Normally will look at the config file for all the adapters to load
   adapters.forEach(function(adapter) {
      // Maybe should check if the adapter is already loaded
      self.registerAdapter(adapter);
   });
};

Haxfred.prototype.loadComponents = function(components) {
   var self = this;
   self.components = self.components || [];

   // @TODO detect if components is a function and execute
   // @TODO add default. Default could be to look in commands directory

   // Normally will look at the config file for all the Components to load 
   components.forEach(function(component) {
      // Maybe should check if the adapter is already loaded
      self.registerConnector(component)(self));
   });
};

Haxfred.prototype.registerAdapter = function(adapter) {
   // May need to use something besides require since require is sync
   this.adapters.push(require(adapter)(this));
}

Haxfred.prototype.registerComponent = function(component) {
   // May need to use something besides require since require is sync
   this.components.push(require(component)(this));
}

Haxfred.prototype.emit = function(event, data) {
   // Do validation
   
   var event_id = Haxfred.createEventUUID();

   // register it somehow

   this.eventEmitter.emit(event, event_id, data);

   // Q all then something.
}

Haxfred.prototype.addListener = Haxfred.prototype.on = function(event, callback) {
   this.eventEmitter.on(event, function(event_id, data) {
      var promise = new Q(); // Create new promise
      // Register promise under event_id
      callback(data,promise);
   });
}

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
