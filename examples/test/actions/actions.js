var Conflux = require('../../../');
var api = require('../api');

module.exports = function(){
  return {
    addValue: Conflux.PromiseAction(api.getPromise),
    addValue2: Conflux.CallbackAction(api.getValue)
  };
};
