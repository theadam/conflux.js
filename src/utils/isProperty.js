var Bacon = require('baconjs');

module.exports = function isProperty(testee){
  return testee instanceof Bacon.Property;
};
