var _ = require('lodash');

var Command = require('./command');

var Commander = function (contexts) {
  // private, is this too naive?
  var defaults = {_default: []};

  var newContexts = _.map(contexts, function (context) {
    defaults[context] = [];
  });

  this.contexts = defaults;

  return this;
};

Commander.prototype.register = function (context, filter, callback) {

  if (!this.contexts.hasOwnProperty(context)) {
    throw new Error('Cannot assign a command to non defined context: ' +  context);
  }

  this.contexts[context].push(new Command(filter, callback));
};

Commander.prototype.route = function (context, input) {
  var matches = {filtered: [], unfiltered: false };

  _.each(this.contexts[context], function (command){

    if (command.match(input)) {
      if (command.re) {
        matches.filtered.push(command);
      } else {
        matches.unfiltered = command;
      }
    }
  }, this);

  if (matches.filtered.length) {
    matches.filtered[0].invoke(context);
  } else if (matches.unfiltered){
    matches.unfiltered.invoke(input);
  }
  return this;
};

module.exports = Commander;
