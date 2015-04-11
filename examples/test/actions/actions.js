var api = require('../api');
var Bacon = require('baconjs');
var R = require('ramda');

function createValueActions(addedFn){
  let addValue = new Bacon.Bus();
  let valueAdded = addedFn(addValue);

  return {
    add: addValue,
    added: valueAdded
  };
}

module.exports = function(){
  return {
    value: createValueActions(bus => bus.map(api.getPromise).flatMapLatest(Bacon.fromPromise)),
    value2: createValueActions(bus => bus.map(R.curry(api.getValue)).flatMapLatest(Bacon.fromNodeCallback))
  };
};
