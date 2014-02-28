var expect = require('chai').expect;

var config = require('../config/development.json');
var Haxfred = require('../lib/haxfred');

describe('haxfred', function () {
  var bot;

  beforeEach(function () {
    bot = new Haxfred(config);
  });

  it('generates proper configuration from supplied object', function () {
    expect(bot).to.have.property('personalRegex');
  });

  it('attaches a commander based router', function () {
    expect(bot.router).to.respondTo('register');
  });
});
