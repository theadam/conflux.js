import isBacon from './isBacon'
import Conflux from '../conflux'

export default function asyncAction(actionFn){
  let request = new Conflux.Bacon.Bus();
  let response = actionFn(request);
  if(!isBacon(response)) throw new Error('Action function did not return an event stream');
  return {
    request,
    response
  };
}
