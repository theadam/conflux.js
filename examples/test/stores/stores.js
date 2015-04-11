var R = require('ramda');

module.exports = function(actions){
  return {
    data: (init = []) => actions.value.added.merge(actions.value2.added).scan(init, R.appendTo),
    loading: actions.value.add.awaiting(actions.value.added).or(
        actions.value2.add.awaiting(actions.value2.added))
  };
};
