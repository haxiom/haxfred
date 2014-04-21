var expect = require('chai').expect;
var sinon = require('sinon');
var Haxfred = require('../lib/haxfred');
var path = require('path');

describe('Haxfred', function () {
  describe('creation', function () {
    it('creates an event property ', function () {
      var haxfred = new Haxfred();

      expect(haxfred).to.have.property('_events');
    });

    it('creates adapters and components properties', function () {
      var haxfred = new Haxfred();

      expect(haxfred.config.adapters).to.be.an('array');
      expect(haxfred.config.components).to.be.an('array');
    });

    it('add configuration options to instance', function () {
      var haxfred = new Haxfred({
        adapters: [
          'first',
          'second'
        ]
      });

        expect(haxfred.config.adapters).to.contain('first', 'second');
        expect(haxfred.config.components).to.be.empty;
      });
    });
    describe('initialization', function () {
//       describe('getRoot', function (){
//
//       })
      it('adds Components', function () {
        var stub = sinon.stub(Haxfred.prototype, '_addModule');

        new Haxfred({
          components: [
            'component1',
            'component2'
          ]
        }).initialize();

        expect(stub.calledTwice).to.be.true;

        stub.restore();
      });

      it('adds adapters', function () {
        var stub = sinon.stub(Haxfred.prototype, '_addModule');

        new Haxfred({
          adapters: [
            'adapter1',
            'adapter2',
            'adapter3'
          ]
        }).initialize();

        expect(stub.calledThrice).to.betrue;
        stub.restore();
      });

      it('requires a path relative to haxfred file', function () {
        var haxfred = new Haxfred({
          adapters: [
            '../test/fixtures/noop-adapter'
          ]
        });

        haxfred.initialize();

        expect(haxfred.adapters.length).to.equal(1);
      });

      it('can be configured to lookup modules at a different path', function () {
        var haxfred = new Haxfred({
          adapters: [
            'noop-adapter'
          ],
          rootDir: path.resolve(__dirname, 'fixtures')
        });

        haxfred.initialize();

        expect(haxfred.adapters.length).to.equal(1);
      });

      it('requires modules from root and node_modules', function () {
        var haxfred = new Haxfred({
          adapters: [
            'path',
            'noop-adapter'
          ],
          rootDir: path.resolve(__dirname, 'fixtures')
        });

        haxfred.initialize();

        expect(haxfred.adapters.length).to.equal(2);
      });

      it('prefers modules in node_modules over local files', function () {
        var haxfred = new Haxfred({
          adapters: [
            'path'
          ],
          rootDir: path.resolve(__dirname, 'fixtures')
        });

        haxfred.initialize();

        expect(haxfred.adapters.length).to.equal(1);
      });

      it('throws an error if module cannot be found', function () {
        var haxfred = new Haxfred({
          adapters: [
            './foo/bar/baz'
          ]
        });

        expect(haxfred.initialize)
        .to.throw(Error);
      });
    });
});
