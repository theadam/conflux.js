import Bacon from 'baconjs'
import descriptors from './descriptors'

function path(parts, obj){
  if(parts.length === 0) return obj;
  if(!obj[parts[0]]) throw new Error('Path does not exist for descriptor' + parts[0] + ' ' + obj);
  return path(parts.slice(1), obj[parts[0]]);
}


export default function(){
  return {
    evaluate: (bus) => bus
      .map((key) => key.split('.'))
      .map((parts) => path(parts, descriptors)),
    changeInput: new Bacon.Bus()
  };
}
