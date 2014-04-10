var _ = require('lodash');
var uuid = require('node-uuid');
var q = require('q');


var Haxfred = function (config) {
  this.config = config;
  this.listeners = [];

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
      self._registerAdapter(adapter);
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
      self._registerComponent(component);
   });
};

Haxfred.prototype._registerAdapter = function(adapter) {
   // May need to use something besides require since require is sync
   this.adapters.push(require(adapter)(this));
}

Haxfred.prototype._registerComponent = function(component) {
   // May need to use something besides require since require is sync
   this.components.push(require(component)(this));
}

// ------- Events -------

// @TODO something was supposed to change with the data passed to the listener or emitter. I forget
Haxfred.prototype.emit = function(event, data) {
   var haxfred = this;
   // @TODO Do validation
   
   var event_id = uuid.v4();
   console.log(event_id);

   // register the event into the events object by creating an empty array
   haxfred.events = haxfred.events || {};
   haxfred.events[event_id] = [];

   // @TODO Change hardcoded emitterResolved function to be a callback created by emitter
   // caller in their Adapter
   function emitterResolved(result) {
     console.log("Event completed");
     console.log(result);
     // Clean up events array
     delete haxfred.events[event_id];
   }

   // Sequential promise based emitting does not work with node's event system
   //
   // This is list of listeners, for the given event, called in sequence waiting for each
   // promise to resolve before calling the next. The initial value is a blank
   // promise so that the first element in the listener array can be called as
   // a function.
   //
   haxfred.listeners[event].reduce( function(previous, next) {
      return previous.then( function() {
        return next(event_id, data).then();
      });
   },q()).then(emitterResolved);
}

Haxfred.prototype.addListener = Haxfred.prototype.on = function(event, callback) {
   var haxfred = this;
   haxfred.listeners[event] = haxfred.listeners[event] || [];
   haxfred.listeners[event].push(function(event_id, data) {
      var deferred = q.defer(); // Create new promise
      callback(data,deferred);
      haxfred.events[event_id].push(deferred.promise);
      return deferred.promise;
   });
}

Haxfred.prototype.out = function (output) {
  this.eventEmitter.emit('out', output);
};

Haxfred.prototype.log = function (output) {
  console.log(output);
}

// May be useful for implementing a different router
//Haxfred.prototype.registerConnector = function (connector) {
//  connector(this);
//  return this;
//};

//_.extend(Haxfred.prototype, EventEmitter.prototype);

module.exports = Haxfred;
