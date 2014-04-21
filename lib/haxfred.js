var _ = require('lodash');
var path = require('path');
// var uuid = require('node-uuid');
// var q = require('q');


/**
 * Create a new Haxfred instance
 * config {object} configuration properties  to be copied onto instance.
 *
 */
var Haxfred = function (config) {
  this._events = {};
  this.config = _.extend({
    adapters: [],
    components: [],
    rootDir: this.getRoot
  }, config);
};

Haxfred.prototype.initialize = function () {
  var root = typeof this.config.rootDir === 'function' ? this.config.rootDir() : this.config.rootDir;
  this.root = root || __dirname;

  this.loadComponents(this.config.components);
  this.loadAdapters(this.config.adapters);

  return this;
};

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

module.exports = Haxfred;
