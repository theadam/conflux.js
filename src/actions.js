var Bacon = require('baconjs');
var _ = require('lodash');

var isBacon = require('./utils/isBacon');

function Action(mapper){
  var bus = new Bacon.Bus();
  var stream = mapper ? mapper(bus) : bus;
  if(!isBacon(stream)) throw new Error('Action mapper function must return a Bacon Observable');
  var buspush = bus.push;
  stream.waiting = bus.awaiting(stream);
  stream.push = (val) => buspush.call(bus, val);
  return stream;
}

function PromiseAction(promiseFunction){
  var len = promiseFunction.length;
  if(len !== 0 && len !== 1){
    throw new Error('PromiseAction callbacks must take either 0 or 1 arguments');
  }
  return _AsyncAction(promiseFunction, Bacon.fromPromise);
}

function CallbackAction(callback){
  var len = callback.length;
  if(len !== 1 && len !== 2){
    throw new Error('CallbackAction callbacks must take either 1 or 2 arguments');
  }
  return _AsyncAction((val) => (cb) => len === 1 ? callback(cb) : callback(val, cb), Bacon.fromNodeCallback);
}

function _AsyncAction(func, baconWrapper){
  return Action((bus) => bus.map(func).flatMapLatest(baconWrapper));
}

function _createActions(descriptor){
  if(_.isString(descriptor)){
    var obj = {};
    obj[descriptor] = Action();
    return obj;
  }
  else if (isBacon(descriptor)){
    return descriptor;
  }
  else if(_.isArray(descriptor)){
    return _.merge.apply(_, _.map(descriptor, _createActions));
  }
  else{
    return _.mapValues(descriptor, _createActions);
  }
}

function Actions(){
  var descriptor = arguments.length > 1 ? Array.prototype.slice.call(arguments) : arguments[0];
  return _createActions(descriptor);
}

module.exports = {
  Actions,
  Action,
  PromiseAction,
  CallbackAction
};
