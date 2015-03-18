var Bacon = require('bacon.model');
var _ = require('lodash');
var isBacon = require('../../utils/isBacon');

module.exports = function getModel(stores, descriptor){
  if(_.isString(descriptor)){
    var obj = {};
    obj[descriptor] = stores[descriptor];
  }
  if(isBacon(stores)){
    return stores;
  }
  if(_.isArray(stores)){
    return _.merge.apply(_, _.map(stores, getModel));
  }
  else{
    return Bacon.Model.combine(stores);
  }
};
