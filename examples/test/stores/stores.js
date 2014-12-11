var actions = require('../actions/actions');
var R = require('ramda');
var Promise = require('es6-promise').Promise;
var Bacon = require('baconjs');

var getPromise = function(val){
  return new Promise(function(resolve){
    setTimeout(function(){
      resolve(val);
    }, 400);
  });
};

var data = actions.action.flatMapLatest(R.pipe(getPromise, Bacon.fromPromise)).scan([], R.appendTo);
var loading = actions.action.awaiting(data);

module.exports = {
  data: data,
  loading: loading
};
