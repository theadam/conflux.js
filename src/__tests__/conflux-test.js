import Conflux from '../conflux'
import expect from 'expect.js'
import isAction from './support/isAction'
import {Property} from 'baconjs'
import Bacon from 'baconjs'
import {Action} from '../actions'
import * as Actions from '../actions'
import combine from '../utils/combine'

function newConflux(actions, stores, init){
  return new Conflux(actions, stores, init);
}

function createConflux(actions, stores, init){
  return Conflux(actions, stores, init);
}

var actionString = 'test';
var actionFunction = () => {return {test: Action()}; };
var storeFunction = (actions) => {return {test: actions.test}; };

function isValidFlux(flux, val){
  expect(flux).to.be.a(Conflux);
  expect(flux.actions.test).to.be.a(Function);
  expect(flux.stores.test).to.be.a(Property);
  expect(flux.stores.test.value).to.be(val);
}

describe('Conflux', function(){
  it('should handle string actions', () => {
    var flux = Conflux(actionString, storeFunction);

    isValidFlux(flux, undefined);
  });

  it('should handle function actions', () => {
    var flux = Conflux(actionFunction, storeFunction);

    isValidFlux(flux, undefined);
  });

  it('should handle initial values', () => {
    var flux = Conflux(actionFunction, storeFunction, {test: 2});

    isValidFlux(flux, 2);
  });

  it('should wire actions with stores', () => {
    var flux = Conflux(actionFunction, storeFunction, {test: 2});

    isValidFlux(flux, 2);
    flux.actions.test(3);
    isValidFlux(flux, 3);
  });

  it('should handle serialization', () => {
    var stores = (actions) => {
      return {
        basic: Bacon.constant(1),
        nested: {
          two: Bacon.constant(2),
          three: Bacon.constant(3),
          again: {
            last: Bacon.constant(4)
          }
        }
      };
    };
    var flux = Conflux('test', stores);

    expect(flux.serialize()).to.eql({
      basic: 1,
      nested: {
        two: 2,
        three: 3,
        again: {
          last: 4
        }
      }
    });
  });

  it('should have proper exports', () => {
    // All action keys
    for(let key of Object.keys(Actions)){
      expect(Actions[key]).to.be(Conflux[key]);
    }
    expect(Conflux.Bacon).to.be(Bacon);
    expect(Conflux.combine).to.be(combine);
  });
});
