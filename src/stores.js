import _ from 'lodash'
import isBacon from './utils/isBacon'
import isProperty from './utils/isProperty'
import wrapProperty from './utils/wrapProperty'

export default function Stores(streams, initialValues){
  let models = {};
  for(let i in streams){
    let stream = streams[i];
    let value = _.isPlainObject(initialValues) ? initialValues[i] : undefined;

    if(stream instanceof Function){
      stream = stream(value);
    }
    if(isBacon(stream)){
      if(!isProperty(stream)){
        stream = stream.toProperty(value);
      }
      models[i] = wrapProperty(stream);
    }
    else{
      models[i] = Stores(stream, value);
    }
  }
  return models;
}
