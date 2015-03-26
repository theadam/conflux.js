import Conflux from './conflux'
import _ from 'lodash'

import isBacon from './utils/isBacon'

export function createActions(actions){
  if(actions instanceof Conflux.Bacon.Bus){
    return {bus: actions, stream: actions, waiting: Conflux.Bacon.constant(false)};
  }
  else if(actions instanceof Function){
    let bus = new Conflux.Bacon.Bus();
    let stream = actions(bus);
    let waiting = bus.awaiting(stream);
    if(!(stream instanceof Conflux.Bacon.Observable)) throw new Error('Action function must return a Bacon Observable');
    return {bus, stream, waiting};
  }
  else if(_.isPlainObject(actions)){
    return _.mapValues(actions, createActions);
  }
  throw new Error('Value not allowed while creating actions: ' + actions);
}

export function fromDescriptor(descriptor){
  if(typeof descriptor === 'string'){
    let obj = {};
    obj[descriptor] = createActions(new Conflux.Bacon.Bus());
    return obj;
  }
  else if(_.isArray(descriptor)){
    if(descriptor.length > 1){
      return _.merge.apply(_, _.map(descriptor, fromDescriptor));
    }
    else if(descriptor.length === 1){
      return fromDescriptor(descriptor[0]);
    }
  }
  else if(_.isPlainObject(descriptor)){
    return _.mapValues(descriptor, fromDescriptor);
  }
  throw new Error('Value not allowed while creating actions from descriptor: ' + descriptor);
}
