var api = require('../api');
var Bacon = require('baconjs');
var R = require('ramda');

module.exports = function(){
  return {
    value: bus => bus.map(api.getPromise).flatMapLatest(Bacon.fromPromise),
    value2: bus => bus.map(R.curry(api.getValue)).flatMapLatest(Bacon.fromNodeCallback)
  };
};
