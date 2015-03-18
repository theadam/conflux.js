var _ = require('lodash');

module.exports = function project(obj, prop){
  if(!_.isPlainObject(obj)){
    return obj[prop];
  }
  return _.mapValues(obj, function(value){
    return project(value, prop);
  });
};
