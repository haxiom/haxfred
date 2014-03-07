var _ = require('lodash');

var Haxfred = require('./lib/haxfred');
var descend = require('./lib/descend')
var haxfredIrc = require('./lib/connectors/haxfred-irc');
var haxfredStd = require('./lib/connectors/haxfred-std');
// this is hardcoded. We should use something like nconf to switch between environments
var config = require('./config/development.json');

haxfred = new Haxfred(config);

// populate haxfred router with commands
descend()
  .wrap(haxfred.router)
  .explore('commands');

haxfred.registerConnector(haxfredIrc);
haxfred.connect();
