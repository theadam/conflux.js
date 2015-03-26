import Conflux from '../conflux'

export default function isBacon(testee){
  return testee instanceof Conflux.Bacon.Observable;
};
