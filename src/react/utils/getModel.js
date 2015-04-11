import _ from 'lodash'

import isBacon from '../../utils/isBacon'
import combine from '../../utils/combine'

export default function getModel(stores, descriptor){
  return combine(internalGetModel(stores, descriptor));
}

function internalGetModel(stores, descriptor){
  if(_.isString(descriptor)){
    return {[descriptor]: stores[descriptor]};
  }
  else if(_.isArray(descriptor)){
    return _.merge.apply(_, _.map(descriptor, (part) => internalGetModel(stores, part)));
  }
  else if(_.isPlainObject(descriptor)){
    return _.mapValues(descriptor, (value, key) => internalGetModel(stores[key], value));
  }
  else{
    throw new Error('Unable to parse descriptor ' + descriptor);
  }
}
