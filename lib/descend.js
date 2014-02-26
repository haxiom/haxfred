'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash')
var Q = require('q');

var defaultOptions = {};

function isValidModule (file) {
  var moduleName;
  var mod;

  if(! /\.js$/.test(file)) return false;

  try {
    moduleName = require.resolve(file);
    return true;
  } catch (e) {
   return false
  }
}

function lookAbout (target, results) {
  var fileStat;

  results = results || [];

  fileStat = fs.statSync(target);

  if (fileStat.isDirectory()) {
    var files = fs.readdirSync(target);

    files.forEach(function (node) {
      lookAbout(path.join(target, node), results);
    });
  }

  if (fileStat.isFile()) {
    if (isValidModule(target)) {
      results.push(target);
    }
  }

  return results;
}

function Descend (options) {
  this.options = _.defaults(defaultOptions, options);
  return this;
}

Descend.prototype.wrap = function (obj) {
  this.target = obj;
  return this;
};

Descend.prototype.explore = function (directory) {
  var self = this;

  if (!self.hasOwnProperty('target')) throw new Error ('No target object defined');


  var modulePaths = lookAbout(directory)

  modulePaths.forEach(function (modulePath) {
    var mod = require(modulePath);
    if (_.isFunction(mod)) {
      mod(self.target);
    }
  });

  return this;
};

module.exports = function (options) {
  return new Descend(options);
}
