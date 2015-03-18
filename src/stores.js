var Bacon = require('bacon.model');
var _ = require('lodash');

var isBacon = require('./utils/isBacon');

function Stores(streams, initialValues){
  var models = {};
  for(var i in streams){
    var stream = streams[i];
    var value = _.isPlainObject(initialValues) ? initialValues[i] : undefined;

    if(_.isFunction(stream)){
      stream = stream(value);
    }
    if(isBacon(stream)){
      var store = Bacon.Model(value);
      store.addSource(stream);
      models[i] = store;
    }
    else{
      models[i] = Stores(stream, value);
    }
  }
  return models;
}

module.exports = Stores;
