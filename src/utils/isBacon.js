var Bacon = require('bacon.model');

module.exports = function isBacon(testee){
  return testee instanceof Bacon.Observable;
};
