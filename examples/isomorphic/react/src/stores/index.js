var R = require('ramda');

module.exports = function createStores(actions){
  return {
    game: {
      results: (init) => actions.game.result.toProperty(init),
      loading: actions.game.request.awaiting(actions.game.result)
    },
    search: {
      results: (init = []) => actions.search.result.map(R.prop('searchResults')).toProperty(init),
      string: (init = '') => actions.search.result.map(R.prop('searchString')).toProperty(init),
      loading: actions.search.request.awaiting(actions.search.result)
    },
    route: actions.setRouteState
  };
};
