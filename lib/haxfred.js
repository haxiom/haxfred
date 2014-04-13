var _ = require('lodash');
var uuid = require('node-uuid');
var q = require('q');


var Haxfred = function (config) {
  this._events = {};
  this.config = _.extend({
    adapters: [],
    components: []
  }, config);

  this.initialize();
};

Haxfred.prototype.initialize = function () {
  this.loadComponents(this.config.components);
  this.loadAdapters(this.config.adapters);
};

Haxfred.prototype.loadComponents = function (components) {
  _.each(components, function  (component) {
    this._addModule('components', component);
  }.bind(this));
};

Haxfred.prototype.loadAdapters = function (adapters) {
  _.each(adapters, function  (adapter) {
    this._addModule('adapters', adapter);
  }.bind(this));
};

Haxfred.prototype._addModule = function (moduleType, module) {
  this.config[moduleType].push(require(module)(this));
};

module.exports = Haxfred;
