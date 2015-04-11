import _ from 'lodash'

import Stores from './stores'
import * as Actions from './actions'
import combine from './utils/combine'

// Not an es6 to allow for 'new'-less instantiation
export default function Conflux(actions, stores, initialValues){
  if(!(this instanceof Conflux)) return new Conflux(actions, stores, initialValues);
  if(actions instanceof Function){
    this.actions = Actions.createActions(actions());
  }
  else{
    this.actions = Actions.fromDescriptor(actions);
  }

  this.stores = Stores(stores(this.actions, initialValues), initialValues);
}

Conflux.prototype.serialize = function(){
  return combine(this.stores).value;
};

let bacon;
Object.defineProperty(Conflux, 'Bacon', {
  get: () => {
    if(!bacon) throw new Error('Use Conflux.with to set the bacon instance');
    return bacon;
  },
  set: (lib) => bacon = lib
});
