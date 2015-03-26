import Bacon from 'baconjs'
import expect from 'expect.js'
import Conflux from '../conflux'
Conflux.Bacon = Bacon;

import * as Actions from '../actions';

import validAction from './support/validAction'

describe('Action', () => {
  describe('createActions', () => {
    it('should return action for a bus', (done) => {
      let action = Actions.createActions(new Bacon.Bus());

      validAction(action);
      action.stream.onValue((val) => {
        expect(val).to.be(2);
        done();
      });
      action.bus.push(2);
    });

    it('should return action for a function', (done) => {
      let action = Actions.createActions((bus) => bus.map((val) => val * val));

      validAction(action);
      action.stream.onValue((val) => {
        expect(val).to.be(4);
        done();
      });
      action.bus.push(2);
    });

    it('should return action for nested action', (done) => {
      let actions = Actions.createActions({
        nested: {
          action: (bus) => bus.map((val) => val * val)
        },
        other: {
          nested: {
            action: new Bacon.Bus()
          }
        }
      });

      validAction(actions.nested.action);
      validAction(actions.other.nested.action);
      actions.nested.action.stream.onValue((val) => {
        expect(val).to.be(4);

        actions.other.nested.action.stream.onValue((val) => {
          expect(val).to.be(2);
          done();
        });
        actions.other.nested.action.bus.push(2);

      });
      actions.nested.action.bus.push(2);

    });

    it('should handle async action/waiting', (done) => {
      let action = Actions.createActions((bus) => bus.delay(1).map((val) => val * val));

      let i = 0;
      Bacon.combineAsArray(action.waiting, action.stream.toProperty(undefined)).onValue(([isLoading, val]) => {
        if(i === 0){
          expect(isLoading).to.be(false);
          expect(val).to.be(undefined);
        }
        else if(i === 1){
          expect(isLoading).to.be(true);
          expect(val).to.be(undefined);
        }
        else if(i === 2){
          expect(isLoading).to.be(false);
          expect(val).to.be(4);
          done();
        }
        else{
          throw new Error('Combined stream changed too many times.');
        }
        i += 1;
      });

      action.bus.push(2);
    });
  });

  describe('fromDescriptor', () => {
    it('should create action with string', () => {
      let actions = Actions.fromDescriptor('test');

      validAction(actions.test);
    });

    it('should create action with multiple strings', () => {
      let actions = Actions.fromDescriptor(['test', 'one', 'two']);

      validAction(actions.test);
      validAction(actions.one);
      validAction(actions.two);
    });

    it('should handle objects', () => {
      let actions = Actions.fromDescriptor({test: 'one'});

      validAction(actions.test.one);
    });

    it('should handle a mix', () => {
      let actions = Actions.fromDescriptor([{test: 'one'}, ['test2'], 'test3', {test4: ['sub1', 'sub2', 'sub3']}]);

      validAction(actions.test.one);
      validAction(actions.test2);
      validAction(actions.test3);
      validAction(actions.test4.sub1);
      validAction(actions.test4.sub2);
      validAction(actions.test4.sub3);
    });

    it('should error when there are observables in an array', () => {
      expect(Actions.fromDescriptor).withArgs([new Bacon.Bus(), new Bacon.Bus()]).to.throwException();
    });
  });

});
