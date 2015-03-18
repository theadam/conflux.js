var R = require('ramda');

module.exports = function(actions){
  return {
    data: (init = []) => actions.addValue.merge(actions.addValue2).scan(init, R.appendTo),
    loading: actions.addValue.waiting.or(actions.addValue2.waiting)
  };
};
