import Bacon from 'baconjs'
import Immutable from 'immutable'
import _ from 'lodash'

import rawDescriptors from './descriptors'

const descriptors = Immutable.fromJS(rawDescriptors);

function descriptorFromPath(path){
  let splitPath = path.split('.');
  let descriptor = descriptors.getIn(splitPath);
  if(!descriptor){
    throw new Error(`${path} not found in marble descriptors.`);
  }
  return descriptor;
}

export default function(){
  return {
    evaluate: (bus) => bus
      .map(descriptorFromPath),
    changeInput: new Bacon.Bus()
  };
}
