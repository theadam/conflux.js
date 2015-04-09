var _ = require('lodash');
var isBacon = require('../../utils/isBacon');
var combine = require('../../utils/combine');

module.exports = function getModel(stores, descriptor){
  if(_.isString(descriptor)){
    return combine({[descriptor]: stores[descriptor]});
  }
  if(_.isArray(descriptor)){
    return _.merge.apply(_, _.map(descriptor, (part) => getModel(stores, part)));
  }
  else if(_.isPlainObject(descriptor)){
    return _.mapValues(descriptor, (value, key) => getModel(stores[key], value));
  }
  else{
    throw new Error('Unable to parse descriptor ' + descriptor);
  }
};
