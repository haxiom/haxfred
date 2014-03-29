var _ = require('lodash');
var EventEmitterClass = require('events').EventEmitter;
var uuid = require('node-uuid');
var q = require('q');


var Haxfred = function (config) {
  this.config = config;
  this.eventEmitter = new EventEmitterClass();

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
      self.registerComponent(component);
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

// ------- Events -------

// @TODO Decide whether emit() is simultaneous listeners or sequential listeners
Haxfred.prototype.emit = Haxfred.prototype.emitAll = function(event, data) {
   this._emitter(event,false,data);
}

Haxfred.prototype.emitSequential = function(event, data) {
   this._emitter(event,true,data);
}


Haxfred.prototype._emitter = function(event, sequential, data) {
   var haxfred = this;
   // Do validation
   
   var event_id = uuid.v4();
   console.log(event_id);

   // register the event into the events object by creating an empty array
   haxfred.events = haxfred.events || {};
   haxfred.events[event_id] = new Array; // @TODO not sure its necessary

   // @TODO Change hardcoded emitterResolved function to be a callback created by emitter
   // caller in their Adapter
   function emitterResolved(result) {
     console.log("Event completed");
     console.log(result);
     // Clean up events array
     delete haxfred.events[event_id];
   }

   // If sequential, chain promises 
   if (sequential) {
      // Sequential promise based emitting does not work with node's event system
      //
      // This is list of listeners, for the given event, called in sequence waiting for each
      // promise to resolve before calling the next. The initial value is a blank
      // promise so that the first element in the listener array can be called as
      // a function.
      //
      // The vanilla node event is never actually emitted
      haxfred.eventEmitter.listeners(event).reduce( function(previous, next) {
         return previous.then( function() {
           return next(event_id, data).then();
         });
      },q()).then(emitterResolved);
   // Else call them simultaneously
   } else {
      // Passing emit to Haxfred's eventEmitter
      haxfred.eventEmitter.emit(event, event_id, data);

      q.all(haxfred.events[event_id]).then(emitterResolved);
   }
}

Haxfred.prototype.addListener = Haxfred.prototype.on = function(event, callback) {
   var haxfred = this;
   haxfred.eventEmitter.on(event, function(event_id, data) {
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
