/* jshint and chai's expect interface do not place nicely
 * so we ignore jshint in our tests :\
 */
/* jshint -W024, expr:true */

// TODO: put these in a common file to reduce boilerplate
// ala https://github.com/domenic/sinon-chai/blob/master/test/common.js

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = require('chai').expect;
var Haxfred = require('../lib/haxfred');
var path = require('path');
var chai = require('chai');

chai.use(expect);
chai.use(sinonChai);

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
      it('adds Components', function () {
        var stub = sinon.stub(Haxfred.prototype, '_addModule');

        new Haxfred({
          components: [
            'component1',
            'component2'
          ]
        }).initialize();

        expect(stub).have.been.calledTwice;
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

        expect(stub).to.have.been.calledThrice;
        stub.restore();
      });

      it('requires a path relative to haxfred file', function () {
        var haxfred = new Haxfred({
          adapters: [
            '../test/fixtures/noop-adapter'
          ],
          rootDir: path.resolve(__dirname, 'fixtures')
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
        var haxfred = new Haxfred({ adapters: [
            './foo/bar/baz'
          ]
        });

        expect(haxfred.initialize)
        .to.throw(Error);
      });
    });

    describe('components and modules', function () {
      it('passes an instance of itself to components', function () {
        var spyModule = sinon.spy();
        var haxfred = new Haxfred();

        haxfred.components.push(spyModule);
        haxfred.registerModules();

        expect(spyModule).to.have.been.calledWith(haxfred);
      });

      it('does not register modules that are not functions', function () {
        var haxfred = new Haxfred();

        expect(function(){
          haxfred._registerModule({'name': 'stringExport'});
        }).to.throw(Error);
      });
    });

    describe('on', function () {
      var haxfred;

      beforeEach(function() {
        haxfred = new Haxfred();
      });

      it('accepts a string, an optional "filter", and a handler function' , function () {
        haxfred.on('foo', /puppies/, function(){
          console.log('baz');
        });

        expect(haxfred._events).to.have.property('foo');
        expect(haxfred._events['foo'][0].filter).to.be.an.instanceOf(RegExp);
        expect(haxfred._events['foo'][0].callback).to.be.an.instanceOf(Function);
      });

      it('properly registers components that do not specify a filter', function() {
         haxfred.on('foo',function() {
           true;
         });

         expect(haxfred._events['foo'][0].filter).to.be.null;
         expect(haxfred._events['foo'][0].callback).to.be.an.instanceOf(Function);
      });
    });
});
