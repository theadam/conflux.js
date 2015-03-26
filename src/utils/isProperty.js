var Conflux = require('../conflux');

export default function isProperty(testee){
  return testee instanceof Conflux.Bacon.Property;
};
