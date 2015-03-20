import _ from 'lodash'

export default function mapLeaves(obj, fn){
  if(!_.isPlainObject(obj)){
    return fn(obj);
  }
  return _.mapValues(obj, function(value){
    return mapLeaves(value, fn);
  });
};
