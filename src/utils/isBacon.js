var Bacon = require('baconjs');

module.exports = function isBacon(testee){
  return testee instanceof Bacon.Observable;
};
