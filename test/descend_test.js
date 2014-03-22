var expect = require('chai').expect;
var path = require('path');
var descend = require('../lib/descend');

var cwd = __dirname;
var fixtures = path.join(cwd, 'support/fixtures/descend');

describe('descend', function () {
  it.skip('scans a directory for files of given type', function () {

  });

  it.skip('ignores files', function () {

  });

  it('is called as a function, able to receive an object of options', function () {

  });

  it('attempts to import files, passing object as argument', function (done) {
    var obj = {};

    expect(obj).to.not.have.property('prop');

    /* Take a look at other apis.
     * I think the nicest would be to:
     *
     * descend({"ignore", "*.glob"})
     * .wrap(obj)
     * .explore(dir1, dir2, {optional: "object of options that override default vaues"})
     * */

    descend()
      .wrap(obj)
      .explore(fixtures);

    // this is bad. sorry
    expect(obj).to.have.property('prop');
    done();
  });
});
