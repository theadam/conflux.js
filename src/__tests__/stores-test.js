import Bacon from 'baconjs'
import Stores from '../stores'
import expect from 'expect.js'
import R from 'ramda'

describe('Stores', () => {
  it('should wrap properties', () => {
    let stores = Stores({test: Bacon.constant(1)});

    expect(stores.test).to.be.a(Bacon.Property);
    expect(stores.test.value).to.be(1);
  });

  it('should not be able to set a property value', () => {
    let stores = Stores({test: Bacon.constant(1)}, {test: 2});

    expect(stores.test).to.be.a(Bacon.Property);
    expect(stores.test.value).to.be(1);
  });

  it('should convert streams to properties', () => {
    let bus = new Bacon.Bus();
    let stores = Stores({test: bus});

    expect(stores.test).to.be.a(Bacon.Property);
    expect(stores.test.value).to.be(undefined);
  });

  it('should be able to set initial stream values', () => {
    let bus = new Bacon.Bus();
    let stores = Stores({test: bus}, {test: 2});

    expect(stores.test).to.be.a(Bacon.Property);
    expect(stores.test.value).to.be(2);
  });

  it('should change property with stream events', () => {
    let bus = new Bacon.Bus();
    let stores = Stores({test: bus}, {test: 2});

    expect(stores.test).to.be.a(Bacon.Property);
    expect(stores.test.value).to.be(2);
    bus.push(3);
    expect(stores.test.value).to.be(3);
  });

  it('should create properties with functions', () => {
    let bus = new Bacon.Bus();
    let stores = Stores({test: (init = []) => bus.scan(init, R.appendTo)});

    expect(stores.test).to.be.a(Bacon.Property);
    expect(stores.test.value).to.eql([]);
    bus.push(3);
    expect(stores.test.value).to.eql([3]);
  });

  it('should feed functions initial values', () => {
    let bus = new Bacon.Bus();
    let stores = Stores({test: (init = []) => bus.scan(init, R.appendTo)}, {test: [1, 2]});

    expect(stores.test).to.be.a(Bacon.Property);
    expect(stores.test.value).to.eql([1, 2]);
    bus.push(3);
    expect(stores.test.value).to.eql([1, 2, 3]);
  });

});
