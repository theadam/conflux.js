import _ from 'lodash'
import Bacon from 'baconjs'

import Stores from './stores'
import * as Actions from './actions'
import combine from './utils/combine'
import mapLeaves from './utils/mapLeaves'
import functionizeAction from './utils/functionizeAction'

// Not an es6 to allow for 'new'-less instantiation
export default function Conflux(actions, stores, initialValues){
  if(!(this instanceof Conflux)) return new Conflux(actions, stores, initialValues);
  if(actions instanceof Function){
    this.actions = actions();
  }
  else{
    this.actions = Actions.Actions(actions);
  }
  this.stores = Stores(stores(this.actions), initialValues);

  // Leaves are actions, but we want to only show their push functions
  this.actions = mapLeaves(this.actions, functionizeAction);
}

Conflux.combine = combine;

Conflux.prototype.serialize = function(){
  return Conflux.combine(this.stores).value;
};

_.merge(Conflux, Actions);

Conflux.Bacon = Bacon;
