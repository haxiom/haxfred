var _ = require('lodash');

var Command = require('./command');

var Commander = function (contexts) {
  this.contexts = {};

  contexts = contexts || [];
  contexts.push('_default');

  this.addContexts(contexts);

  return this;
};

Commander.prototype.addContexts = function (contexts) {
   _.each(contexts, function (context) {
     if (!this.contexts[context]) {
      this.contexts[context] = [];
     }
  }, this);

  return this;
};

Commander.prototype.register = function (context, filter, callback) {
  if (!this.contexts.hasOwnProperty(context)) {
    throw new Error('Cannot assign a command to non defined context: ' +  context);
  }

  this.contexts[context].push(new Command(filter, callback));
};

Commander.prototype.route = function (context, input) {
  var output;
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
    output = matches.filtered[0].invoke(input);
  } else if (matches.unfiltered){
    output = matches.unfiltered.invoke(input);
  }

  return output;
};

module.exports = Commander;
