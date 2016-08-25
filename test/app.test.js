mocha.setup('bdd');
mocha.checkLeaks();
mocha.globals(['jQuery']);

var expect = chai.expect;

describe("#", function() {
  it('thing', function() {
    expect(true).to.equal(true);
  });
  mocha.run();
});
