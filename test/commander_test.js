var expect = require('chai').expect;
var sinon = require('sinon');

var Commander = require('../lib/commander');

describe('Commander', function () {

    var c;

    beforeEach(function () {
    c = new Commander([
        'normal',
        'pm',
        'leave'
      ]);
    });

    it('initializes with an array of contexts, merging them with its own default context', function () {
      expect(c.contexts).to.have.property('pm');
    });

    describe('registering commands', function () {
      it('registers a command with a context, filter, and callback', function () {
        c.register('normal', /foo/, function () {});
        c.register('normal', 'bar', function () {});

        expect(c.contexts.normal).to.have.length(2);
      });

      it('throws an error when registering commands for non-existant contexts', function () {
        try {
          c.register('does-not-exist', /foo/, function () {});
        } catch(e) {
          expect(e).to.be.an.instanceOf(Error);
        }
      });

      it('invokes matching 1st matching route', function () {
        var called = null;
        c.register('normal', /food/, function () {called = true;});
        c.register('normal', 'bar', function () {});
        c.register('normal', 'baz', function () {});
        c.register('pm', /food/, function () {});

        c.route('normal', 'I really want some food. You know?');

        expect(called).to.be.true;
      });

      it('returns output of command callback', function () {
        var input = 'I really want some bar food. You know?';
        var callbackOutput = 'A frosty beverage sounds nice.';

        c.register('normal', 'bar', function () { return callbackOutput; });

        output = c.route('normal', input);

        expect(output).to.equal(callbackOutput);
      });

      it('prefers routes with specific regexes to routes with .*', function () {
        var called = null;
        c.register('normal', function () {
          called = true;
        });

        c.route('normal','I really want some food. You know?');

        expect(called).to.be.true;
      });

      it('navigates multiple contexts', function () {
        var re = /I want some food/;
        var input = "I said to myself, I want some food. So I got some.";
        var called = false;
        var output;

        c.register('normal', re, function () {});
        c.register('leave', re, function () {});
        c.register('pm', function () {});
        c.register('pm', re, function () {called = true; return "Hello"});

        output = c.route('pm', input);

        expect(called).to.be.true;
      });

    });

});
