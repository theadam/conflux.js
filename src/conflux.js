import _ from 'lodash'

import Stores from './stores'
import * as Actions from './actions'
import combine from './utils/combine'
import mapLeaves from './utils/mapLeaves'
import isAction from './utils/isAction'

// Not an es6 to allow for 'new'-less instantiation
export default function Conflux(actions, stores, initialValues){
  if(!(this instanceof Conflux)) return new Conflux(actions, stores, initialValues);
  if(actions instanceof Function){
    this.actions = Actions.createActions(actions());
  }
  else{
    this.actions = Actions.fromDescriptor(actions);
  }
  // Expose all the streams from the actions
  let streamsForStores = mapLeaves(this.actions, isAction, (action) => {
    let stream = action.stream;
    stream.bus = action.bus;
    stream.waiting = action.waiting;
    return stream;
  });

  this.stores = Stores(stores(streamsForStores), initialValues);

  // Expose all the busses from the actions
  this.actions = mapLeaves(this.actions, isAction, (action) => {
    let bus = action.bus;
    bus.stream = action.stream;
    bus.waiting = action.waiting;
    return bus;
  });

}

Conflux.prototype.serialize = function(){
  return combine(this.stores).value;
};
