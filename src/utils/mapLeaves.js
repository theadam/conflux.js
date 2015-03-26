import _ from 'lodash'

export default function mapLeaves(obj, leafPredicate, fn){
  if(leafPredicate(obj)){
    return fn(obj);
  }
  return _.mapValues(obj, function(value){
    return mapLeaves(value, leafPredicate, fn);
  });
};
