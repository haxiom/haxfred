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
  this.config = _.extend({
    adapters: [],
    components: []
  }, config);
};

Haxfred.prototype.initialize = function () {
  // requires from within haxfred
  // are going to resolve from the location of 'haxfred.js'
  // to get around this (at least for now) we allow
  // the user to pass in an absolute path, or a function that will return an absolute path
  var root = typeof this.config.rootDir === 'function' ? this.config.rootDir() : this.config.rootDir;
  // we default to the directory that haxfred.js lives in
  this.root = root || __dirname;

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
    resolvedPath = path.resolve(this.root, modulePath);
  }

  if (!this[moduleType]) {
    this[moduleType] = [];
  }

  this[moduleType].push(require(resolvedPath));
};

Haxfred.prototype._

module.exports = Haxfred;
