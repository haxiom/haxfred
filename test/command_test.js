var expect = require('chai').expect;

var Command = require('../lib/command');

describe('Command', function () {
  it('Accepts a string, regular expression, or function as a matcher. Functions default to matching everything, and do not have an re property', function () {
    var regexCommand = new Command(/foo/, function () {});
    var stringCommand = new Command('Bar', function () {});
    var everythingCommand = new Command(function () {});

    expect(regexCommand.re).to.be.a('RegExp');
    expect(stringCommand.re).to.be.a('RegExp');
    expect(everythingCommand.re).to.be.a('undefined');

  });

  it('Matches a given input, and assigns matching groups to matches property of instance', function () {
    var regexCommand = new Command(/bar$/, function (context) {
      assert(context.hasOwnProperty('matches'));
    });

    expect(regexCommand.match('and then we went to the bar')).to.be.ok;
    expect(regexCommand.matches).to.include.keys('0');
    expect(regexCommand.matches['0']).to.equal('bar');
  });

  it('matches everything, if only a callback is provided', function () {
    var everythingCommand = new Command(function () { });

    everythingCommand.match('fdfsdfds');

    expect(everythingCommand.matches).to.be.ok;
  });

  describe('matching and invoking', function () {
    var input = 'I went to the bar, to get some delicious beer. My friend Sam was there.';

    it('matches a given string, populating instance.matches with any groups', function () {
      var regexCommand = new Command(/(bar)/, function (data) { });
      expect(regexCommand.match(input)).to.be.truthy;
      expect(regexCommand.matches).to.have.property('1');
    });

    it('invokes given callback with match data, when invoke is called and match is true', function (done) {
      var regexCommand = new Command(/(bar|Sam)/, function (data) {
        expect(data.matches['1']).to.equal('bar');
        done();
      });

      regexCommand.match(input);
      regexCommand.invoke();
    });
  });
});
