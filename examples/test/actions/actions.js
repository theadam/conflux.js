var api = require('../api');
var Bacon = require('baconjs');
var R = require('ramda');

module.exports = function(){
  return {
    addValue: (bus) => bus.map(api.getPromise).flatMapLatest(Bacon.fromPromise),
    addValue2: (bus) => bus.map(R.curry(api.getValue)).flatMapLatest(Bacon.fromNodeCallback)
  };
};
