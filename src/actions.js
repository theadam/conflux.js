import Bacon from 'baconjs'
import _ from 'lodash'

import isBacon from './utils/isBacon'

export function Action(mapper){
  let bus = new Bacon.Bus();
  let stream = mapper ? mapper(bus) : bus;
  if(!isBacon(stream)) throw new Error('Action mapper function must return a Bacon Observable');
  stream.waiting = bus.awaiting(stream);
  let buspush = bus.push;
  let busplug = bus.plug;
  stream.push = (val) => buspush.call(bus, val);
  stream.plug = (val) => busplug.call(bus, val);
  return stream;
}

export function PromiseAction(promiseFunction){
  let len = promiseFunction.length;
  if(len !== 0 && len !== 1){
    throw new Error('PromiseAction callbacks must take either 0 or 1 arguments');
  }
  return _AsyncAction(promiseFunction, Bacon.fromPromise);
}

export function CallbackAction(callback){
  let len = callback.length;
  if(len !== 1 && len !== 2){
    throw new Error('CallbackAction callbacks must take either 1 or 2 arguments');
  }
  return _AsyncAction((val) => (cb) => len === 1 ? callback(cb) : callback(val, cb), Bacon.fromNodeCallback);
}

function _AsyncAction(func, baconWrapper){
  return Action((bus) => bus.map(func).flatMapLatest(baconWrapper));
}

function _createActions(descriptor){
  if(isBacon(descriptor)) throw new Error('Bacon Observables are not allowed while create Actions automatically.  Use a function to create Actions manually.');
  if(typeof descriptor === 'string'){
    let obj = {};
    obj[descriptor] = Action();
    return obj;
  }
  else if(_.isArray(descriptor)){
    if(descriptor.length > 1){
      return _.merge.apply(_, _.map(descriptor, _createActions));
    }
    else if(descriptor.length === 1){
      return _createActions(descriptor[0]);
    }
  }
  else{
    return _.mapValues(descriptor, _createActions);
  }
}

export function Actions(){
  let descriptor = arguments.length > 1 ? Array.prototype.slice.call(arguments) : arguments[0];
  return _createActions(descriptor);
}
