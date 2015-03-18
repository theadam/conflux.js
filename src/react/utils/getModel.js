var _ = require('lodash');
var isBacon = require('../../utils/isBacon');
var combine = require('../../utils/combine');

module.exports = function getModel(stores, descriptor){
  if(_.isString(descriptor)){
    stores = stores[descriptor];
  }
  if(isBacon(stores)){
    return stores;
  }
  if(_.isArray(stores)){
    return _.merge.apply(_, _.map(stores, getModel));
  }
  else{
    return combine(stores);
  }
};
