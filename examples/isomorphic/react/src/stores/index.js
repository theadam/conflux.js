var R = require('ramda');

module.exports = function createStores(actions){
  return {
    game: {
      results: (init) => actions.game.response.toProperty(init),
      loading: actions.game.request.awaiting(actions.game.response)
    },
    search: {
      results: (init = []) => actions.search.response.map(R.prop('searchResults')).toProperty(init),
      string: (init = '') => actions.search.response.map(R.prop('searchString')).toProperty(init),
      loading: actions.search.request.awaiting(actions.search.response)
    },
    route: actions.setRouteState
  };
};
