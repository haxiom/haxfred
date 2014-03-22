var _ = require('lodash');

var matchAll = /.*/;

/**
 * Represents an individual command, to be registered with
 * a function, simple string, or regular expression
 * @param match {function|string|RegExp} function will be treated as .* string will be converted to a simple regex
 */
var Command = function (match, callback) {
  this.matches = {};

  this.callback = callback;

  if (_.isFunction(match)) {
    // if we receive a function as the match
    // param, assume there is no match
    this.callback = match;
  } else if (_.isString(match)) {
    // if we receive a string
    // create a regular expression with it
    this.re = new RegExp(match);
  } else {
    // otherwise, just use the regex
    this.re = match;
  }
};

/**
 * Match an input against command's regular expression.
 * Modifies, instances's matches property.
 * @param input {string} input to be matched
 */

Command.prototype.match = function (input) {
  var match = this.re ? this.re.exec(input) : matchAll.exec(input);

  if (!match) return false;

  for (var i = 0, l = match.length; i < l; i ++) {
    this.matches[i] = match[i];
  }

  return true;
};

/**
 * Invoke callback, with matches and optional data.
 * @param data {object} object of data to be passed to
 * callback function.
 *
 */
Command.prototype.invoke = function (data) {
  data = data || {};

  _.extend(data, {matches: this.matches});

  return this.callback.call(this.callback, data);
};

module.exports = Command;
