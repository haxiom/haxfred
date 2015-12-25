// TODO: put these in a common file to reduce boilerplate
// ala https://github.com/domenic/sinon-chai/blob/master/test/common.js

import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import { expect } from 'chai'
import Haxfred from '../src/haxfred'
import path from 'path'
import chai from 'chai'

chai.use(expect)
chai.use(sinonChai)

describe('Haxfred', function () {
  describe('creation', function () {
    beforeEach(function () {
      this.haxfred = new Haxfred()
    })

    it('creates an event property ', function () {
      expect(this.haxfred).to.have.property('_events')
    })

    it('creates adapters and components properties', function () {
      expect(this.haxfred.config.adapters).to.be.an('array')
      expect(this.haxfred.config.components).to.be.an('array')
    })

    it('add configuration options to instance', function () {
      let haxfred = new Haxfred({
        adapters: [
          'first',
          'second'
        ]
      })

      expect(haxfred.config.adapters).to.contain('first', 'second')
      expect(haxfred.config.components).to.be.empty
    })
  })
  describe('initialization', function () {
    it('adds Components', function () {
      let stub = sinon.stub(Haxfred.prototype, '_addModule')

      new Haxfred({
        components: [
          'component1',
          'component2'
        ]
      }).initialize()

      expect(stub).have.been.calledTwice
      stub.restore()
    })

    it('adds adapters', function () {
      let stub = sinon.stub(Haxfred.prototype, '_addModule')

      new Haxfred({
        adapters: [
          'adapter1',
          'adapter2',
          'adapter3'
        ]
      }).initialize()

      expect(stub).to.have.been.calledThrice
      stub.restore()
    })

    it('requires a path relative to haxfred file', function () {
      let haxfred = new Haxfred({
        adapters: [
          '../test/fixtures/noop-adapter'
        ],
        rootDir: path.resolve(__dirname, 'fixtures')
      })

      haxfred.loadAdapters(haxfred.config.adapters)

      expect(haxfred.adapters.length).to.equal(1)
    })

    it('can be configured to lookup modules at a different path', function () {
      let haxfred = new Haxfred({
        adapters: [
          'noop-adapter'
        ],
        rootDir: path.resolve(__dirname, 'fixtures')
      })

      haxfred.loadAdapters(haxfred.config.adapters)

      expect(haxfred.adapters.length).to.equal(1)
    })

    it('requires modules from root and node_modules', function () {
      let haxfred = new Haxfred({
        adapters: [
          'path',
          'noop-adapter'
        ],
        rootDir: path.resolve(__dirname, 'fixtures')
      })

      haxfred.loadAdapters(haxfred.config.adapters)

      expect(haxfred.adapters.length).to.equal(2)
    })

    it('prefers modules in node_modules over local files', function () {
      let haxfred = new Haxfred({
        adapters: [
          'path'
        ],
        rootDir: path.resolve(__dirname, 'fixtures')
      })

      haxfred.loadAdapters(haxfred.config.adapters)

      expect(haxfred.adapters.length).to.equal(1)
    })

    it('throws an error if module cannot be found', function () {
      let haxfred = new Haxfred({ adapters: [
        './foo/bar/baz'
      ]
      })

      expect(haxfred.initialize)
        .to.throw(Error)
    })
  })

  describe('components and modules', function () {
    beforeEach(function () {
      this.haxfred = new Haxfred()
    })

    it('passes an instance of itself to components', function () {
      let spyModule = sinon.spy()

      this.haxfred.components.push(spyModule)
      this.haxfred.registerModules()

      expect(spyModule).to.have.been.calledWith(this.haxfred)
    })

    it('does not register modules that are not functions', function () {
      this.haxfred.components.push({ 'name': 'stringExport' })

      expect(() => {
        this.haxfred.registerModules()
      }).to.throw('You have attempted to use a module that does not export a function')
    })

    it('does not register component if haxfred does not have required adapter', function () {
      let component = sinon.spy()
      component.requires = {
        adapters: ['foo']
      }

      this.haxfred.components.push(component)

      expect(() => {
        this.haxfred.registerModules()
      }).to.throw('A module requires the adapter "foo", but it was not found')
    })

    it('registers component if haxfred does have required adapter in config', function () {
      let component = sinon.spy()
      component.requires = {
        adapters: ['foo']
      }

      this.haxfred.config.adapters.push('foo')
      this.haxfred.components.push(component)

      this.haxfred.registerModules()

      expect(component).to.be.calledWith(this.haxfred)
    })

    it('does not register component if haxfred does not have required component', function () {
      let component = sinon.spy()
      component.requires = {
        components: ['foo']
      }

      this.haxfred.components.push(component)

      expect(() => {
        this.haxfred.registerModules()
      }).to.throw('A module requires the component "foo", but it was not found')
    })

    it('registers component if haxfred does have required adapter in config', function () {
      let component = sinon.spy()
      component.requires = {
        components: ['foo']
      }

      this.haxfred.config.components.push('foo')
      this.haxfred.components.push(component)

      this.haxfred.registerModules()

      expect(component).to.be.calledWith(this.haxfred)
    })

    it('does not register component if haxfred does not have required config', function () {
      let component = sinon.spy()
      component.requires = {
        config: ['foo']
      }

      this.haxfred.components.push(component)

      expect(() => {
        this.haxfred.registerModules()
      }).to.throw('A module requires the config "foo", but it was not found')
    })

    it('registers component if haxfred does have required config', function () {
      let component = sinon.spy()
      component.requires = {
        config: ['foo']
      }

      this.haxfred.config.foo = 'foo'
      this.haxfred.components.push(component)

      this.haxfred.registerModules()

      expect(component).to.be.calledWith(this.haxfred)
    })

    it('does not register component if haxfred does not have required nested config', function () {
      let component = sinon.spy()
      component.requires = {
        config: ['foo.bar.baz']
      }

      this.haxfred.components.push(component)

      expect(() => {
        this.haxfred.registerModules()
      }).to.throw('A module requires the config "foo.bar.baz", but it was not found')
    })

    it('registers component if haxfred does have required nested config', function () {
      let component = sinon.spy()
      component.requires = {
        config: ['foo.bar.baz']
      }

      this.haxfred.config.foo = { bar: { baz: 'foobarbaz' } }
      this.haxfred.components.push(component)

      this.haxfred.registerModules()

      expect(component).to.be.calledWith(this.haxfred)
    })
  })

  describe('on', function () {
    beforeEach(function () {
      this.haxfred = new Haxfred()
    })

    it('accepts a string, an optional "filter", and a handler function', function () {
      this.haxfred.on('foo', /puppies/, function () {
        console.log('baz')
      })

      expect(this.haxfred._events).to.have.property('foo')
      expect(this.haxfred._events['foo'][0].filter).to.be.an.instanceOf(RegExp)
      expect(this.haxfred._events['foo'][0].callback).to.be.an.instanceOf(Function)
    })

    it('properly registers components that do not specify a filter', function () {
      this.haxfred.on('foo', function () {
        true
      })

      expect(this.haxfred._events['foo'][0].filter).to.be.null
      expect(this.haxfred._events['foo'][0].callback).to.be.an.instanceOf(Function)
    })
  })

  describe('emit', function () {
    beforeEach(function () {
      this.haxfred = new Haxfred()
    })

    it('calls onComplete with the data object', function (done) {
      this.haxfred._events['foo'] = []
      this.haxfred._events['foo'][0] = {
        callback: function (data, deferred) {
          deferred.resolve()
        },
        filter: null
      }

      let data = {
        thing: 'baz'
      }

      data.onComplete = sinon.spy(function () {
        expect(data.onComplete).to.be.called
        done()
      })

      this.haxfred.emit('foo', data)
    })

    it('accepts a string, a data object', function (done) {
      let deferringFunction = sinon.spy(function (data, deferred) {
        deferred.resolve()
      })

      let data = {
        baz: 'shit',
        onComplete: function () {
          expect(deferringFunction.args[0][0]).to.equal(data)
          expect(deferringFunction.args[0][1]).to.have.property('resolve')
          done()
        }
      }

      this.haxfred._events['foo'] = []
      this.haxfred._events['foo'][0] = {
        callback: deferringFunction,
        filter: function () { return true }
      }

      this.haxfred.emit('foo', data)
    })

    it('calls all listeners for that event', function (done) {
      let deferringFunction = sinon.spy(function (data, deferred) {
        deferred.resolve()
      })
      let deferringFunction2 = sinon.spy(function (data, deferred) {
        deferred.resolve()
      })

      this.haxfred._events['foo'] = []
      this.haxfred._events['foo'][0] = {
        callback: deferringFunction,
        filter: function () { return true }
      }
      this.haxfred._events['foo'][1] = {
        callback: deferringFunction2,
        filter: function () { return true }
      }

      this.haxfred.emit('foo', {
        onComplete: function () {
          expect(deferringFunction).to.be.calledOnce
          expect(deferringFunction2).to.be.calledAfter(deferringFunction)
          done()
        }
      })
    })

    it('calls are filtered with a String', function (done) {
      // Create spy that auto resolves defers
      let deferringFunction = sinon.spy(function (data, deferred) {
        deferred.resolve()
      })

      this.haxfred._events['foo'] = []
      // First listener that should match the content
      this.haxfred._events['foo'][0] = {
        callback: deferringFunction,
        filter: 'bunnies'
      }
      // Second listener that shouldnt be called
      this.haxfred._events['foo'][1] = {
        callback: deferringFunction,
        filter: 'birdies'
      }

      this.haxfred.emit('foo', {
        content: 'bunnies',
        bar: 'baz',
        onComplete: function () {
          expect(deferringFunction).to.be.calledOnce
          done()
        }
      })
    })

    it('calls are filtered with a Regex', function (done) {
      // Create spy that auto resolves defers
      let deferringFunction = sinon.spy(function (data, deferred) {
        deferred.resolve()
      })

      this.haxfred._events['foo'] = []

      // First listener that should match the content
      this.haxfred._events['foo'][0] = {
        callback: deferringFunction,
        filter: /bunnies/
      }

      // Second listener that shouldn't be called
      this.haxfred._events['foo'][1] = {
        callback: deferringFunction,
        filter: /birdies/
      }

      this.haxfred.emit('foo', {
        content: 'bunnies',
        bar: 'baz',
        onComplete: function () {
          expect(deferringFunction).to.be.calledOnce
          done()
        }
      })
    })

    it('calls are filtered with a Function', function (done) {
      // Create spy that auto resolves defers
      let deferringFunction = sinon.spy(function (data, deferred) {
        deferred.resolve()
      })

      // Spy for checking that the filter function receives its arguments
      let filterSpy = sinon.spy(function (data) {
        return false
      })
      this.haxfred._events['foo'] = []

      // First listener for checking the arguments
      this.haxfred._events['foo'][0] = {
        callback: deferringFunction,
        filter: filterSpy
      }

      // Second listener that shouldn't be called
      this.haxfred._events['foo'][1] = {
        callback: deferringFunction,
        filter: function () {
          return false
        }
      }

      // Third 'truthy' filtered listener that should be called
      this.haxfred._events['foo'][1] = {
        callback: deferringFunction,
        filter: function () {
          return 'things'
        }
      }

      let data = {
        content: 'bunnies',
        bar: 'baz',
        onComplete: function () {
          expect(filterSpy).to.be.calledOnce
          expect(filterSpy).to.be.calledWith(data)
          expect(deferringFunction).to.be.calledOnce
          done()
        }
      }

      this.haxfred.emit('foo', data)
    })
  })
})
