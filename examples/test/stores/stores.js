var R = require('ramda');

module.exports = function(actions){
  return {
    data: (init = []) => actions.value.request.merge(actions.value2.request).scan(init, R.appendTo),
    loading: actions.value.request.awaiting(actions.value.response).or(
        actions.value2.request.awaiting(actions.value2.response))
  };
};
