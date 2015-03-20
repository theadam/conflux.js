import {Actions, Action, PromiseAction, CallbackAction} from '../actions';
import Bacon from 'baconjs'
import expect from 'expect.js'
import isAction from './support/isAction'

describe('Action', () => {

  describe('Default Action', () => {
    let action;

    beforeEach(() => {
      action = Action();
    });

    it('should return a bacon stream', () => {
      expect(action).to.be.a(Bacon.Observable);
      expect(action).to.be.a(Bacon.Bus);
    });

    it('should be synchronous', () => {
      let value;
      let unsub = action.onValue(() => value = 1);
      action.push();
      expect(value).to.be(1);
      unsub();
    });

    it('should have a waiting property', () => {
      let waiting = action.waiting;
      expect(waiting).to.be.a(Bacon.Property);
      let value;

      let unsub = waiting.onValue((isWaiting) => {
        value = 1;
        expect(isWaiting).to.be(false);
      });
      expect(value).to.be(1);
      unsub();

      action.push();

      unsub = waiting.onValue((isWaiting) => {
        value = 2;
        expect(isWaiting).to.be(false);
      });
      expect(value).to.be(2);
      unsub();
    });

    it('push method should be bound', () => {
      let push = action.push;

      let value;
      let unsub = action.onValue(() => value = 1);
      push();
      expect(value).to.be(1);
      unsub();
    });

    it('plug method should be bound', () => {
      let plug = action.plug;
      let bus = new Bacon.Bus();
      plug(bus);

      let value;
      let unsub = action.onValue(() => value = 1);
      bus.push();
      expect(value).to.be(1);
      unsub();
    });
  });

  describe('With Mapper', () => {
    it('should fail if mapper doesnt return an observable', () => {
      expect(Action).withArgs(() => 1).to.throwException();
    });

    it('should allow mapping values', (done) => {
      let action = Action((stream) => stream.map((x) => x + 1));
      action.onValue((val) => {
        expect(val).to.be(2);
        done();
      });
      action.push(1);
    });
  });

  describe('Promise Action', () => {
    it('shouldnt accept more than 1 arg', () => {
      expect(PromiseAction).withArgs((a, b) => {}).to.throwException();
    });

    it('should resolve promises', (done) => {
      let action = PromiseAction((val) => Promise.resolve(val));

      action.onValue((val) => {
        expect(val).to.be(5);
        done();
      });

      action.push(5);
    });
  });

  describe('Callback Action', () => {
    it('shouldnt more than 2 args', () => {
      expect(CallbackAction).withArgs((a, b, c) => {}).to.throwException();
    });

    it('should resolve callbacks', (done) => {
      let action = CallbackAction((val, cb) => cb(null, val));

      action.onValue((val) => {
        expect(val).to.be(5);
        done();
      });

      action.push(5);
    });

    it('should resolve single arg callbacks', (done) => {
      let action = CallbackAction((cb) => cb(null, 5));

      action.onValue((val) => {
        expect(val).to.be(5);
        done();
      });

      action.push(7);
    });
  });

  describe('Actions', () => {
    function testActions(key){
      function createActions(){
        return Actions[key](Actions, Array.prototype.slice.call(arguments));
      }

      describe(key, () => {
        it('should create action with string', () => {
          let actions = createActions('test');

          isAction(actions.test);
        });

        it('should create action with multiple strings', () => {
          let actions = createActions('test', 'one', 'two');

          isAction(actions.test);
          isAction(actions.one);
          isAction(actions.two);
        });

        it('should handle objects', () => {
          let actions = createActions({test: 'one'});

          isAction(actions.test.one);
        });

        it('should handle a mix', () => {
          let actions = createActions({test: 'one'}, ['test2'], 'test3', {test4: ['sub1', 'sub2', 'sub3']});

          isAction(actions.test.one);
          isAction(actions.test2);
          isAction(actions.test3);
          isAction(actions.test4.sub1);
          isAction(actions.test4.sub2);
          isAction(actions.test4.sub3);
        });

        it('should error when there are observables in an array', () => {
          expect(createActions).withArgs([Action(), Action()]).to.throwException();
        });
      });
    }

    testActions('call'); // Tests with an arg of an array
    testActions('apply'); // Tests with a number of arguments
  });

});
