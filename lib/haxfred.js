var _ = require('lodash');
var q = require('q');
var path = require('path');

/**
 * Create a new Haxfred instance
 * config {object} configuration properties  to be copied onto instance.
 *
 */
var Haxfred = function (config) {
  this._events = {};
  this.adapters = [];
  this.components = [];
  this.config = _.extend({
    adapters: [],
    components: [],
    rootDir: __dirname
  }, config);

  // requires from within haxfred
  // are going to resolve from the location of 'haxfred.js'
  // to get around this (at least for now) we allow
  // the user to pass in an absolute path, or a function that will return an absolute path
  // defaulting to __dirname (the node default) if nothing is passed in
  this._rootDir = typeof this.config.rootDir === 'function' ? this.config.rootDir() : this.config.rootDir;
};

Haxfred.prototype.initialize = function () {
  this.loadComponents(this.config.components);
  this.loadAdapters(this.config.adapters);

  return this;
};

// we might be bale to get away
// with merging loadComponents
// and loadAdapters into one function
// but we'll leave them for now
// in case we want to add some
// setup that is particular to each type
Haxfred.prototype.loadComponents = function (components) {
  _.each(components, function  (component) {
    this._addModule('components', component);
  }.bind(this));

  return this;
};

Haxfred.prototype.loadAdapters = function (adapters) {
  _.each(adapters, function  (adapter) {
    this._addModule('adapters', adapter);
  }.bind(this));

  return this;
};

// 'nodeModule'
// './adapters/foo'
Haxfred.prototype._addModule = function (moduleType, modulePath) {
  var resolvedPath;

  // attempt to load as a node_module
  // otherwise, catch the error that require generates
  // and try load locally from an absolute path
  // node will rais an error if this fails
  // (which is what we want, because it's a configuration
  // issue) so we don't rethrow
  try {
    resolvedPath = require.resolve(modulePath);
  } catch (e) {
    resolvedPath = path.resolve(this._rootDir, modulePath);
  }

  this[moduleType].push(require(resolvedPath));
};

// this seems like a lot of indirection
// but I like the idea of keeping this seperate
// instead of requiring the module and passing haxfred
// to it right away. It's clearer and more testable.
Haxfred.prototype.registerModules = function () {
  var allModules = this.adapters.concat(this.components);

  allModules.forEach(function(module){
    this._registerModule(module);
  }.bind(this));
};

// we could probably just put this in the body
// of the foreach within registerModules
Haxfred.prototype._registerModule = function (module) {
  if (typeof module !== 'function') {
   throw new Error('You have attempted to use a module that does not export a function');
  }

  module(this);
};

Haxfred.prototype.on = function (event, filter, callback) {
  if (typeof callback === 'undefined') {
    callback = filter;
    filter = null;
  }

  if (!this._events[event]) {
    this._events[event] = [];
  }

  this._events[event].push({
    callback: callback,
    filter: filter
  });
};

module.exports = Haxfred;
