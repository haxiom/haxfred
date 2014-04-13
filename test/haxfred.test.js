var expect = require('chai').expect;
var sinon = require('sinon');
var Haxfred = require('../lib/haxfred');

describe('Haxfred', function () {
  describe('initialization', function () {
    it('creates an event property ', function () {
      haxfred = new Haxfred();

      expect(haxfred).to.have.property('_events');
    });

    it('creates adapters and components properties', function () {
      haxfred = new Haxfred();

      expect(haxfred.config.adapters).to.be.an('array');
      expect(haxfred.config.components).to.be.an('array');
    });

    it('add configuration options to instance', function () {
      var initialize = sinon.stub(Haxfred.prototype, 'initialize');

      haxfred = new Haxfred({
        adapters: [
          'first',
          'second'
        ]
      });

      expect(haxfred.config.adapters).to.contain('first', 'second');
      expect(haxfred.config.components).to.be.empty;

      initialize.restore();
    });

    it('adds Components', function () {
      var stub = sinon.stub(Haxfred.prototype, '_addModule');

      var haxfred = new Haxfred({
        components: [
          'component1',
          'component2'
        ]
      });

      expect(stub.calledTwice).to.be.true;

      stub.restore();
    });

    it('Adapters', function () {
      var stub = sinon.stub(Haxfred.prototype, '_addModule');

      new Haxfred({
        adapters: [
          'adapter1',
          'adapter2',
          'adapter3'
        ]
      });

      expect(stub.calledThrice).to.be.true;
      stub.restore();
    });
  });
});
