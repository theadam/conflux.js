var _ = require('lodash');

var isBacon = require('./utils/isBacon');
var isProperty = require('./utils/isProperty');
var wrapProperty = require('./utils/wrapProperty');

function Stores(streams, initialValues){
  var models = {};
  for(var i in streams){
    let stream = streams[i];
    var value = _.isPlainObject(initialValues) ? initialValues[i] : undefined;

    if(_.isFunction(stream)){
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

module.exports = Stores;
