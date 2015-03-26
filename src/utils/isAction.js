import Conflux from '../conflux'

export default function isAction(action){
  return action.bus instanceof Conflux.Bacon.Bus &&
    action.stream instanceof Conflux.Bacon.Observable &&
    action.waiting instanceof Conflux.Bacon.Property;
}
