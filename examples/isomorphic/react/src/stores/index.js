var R = require('ramda');

module.exports = function createStores(actions){
  return {
    game: {
      results: (init) => actions.loadGame.toProperty(init),
      loading: actions.loadGame.waiting
    },
    search: {
      results: (init = []) => actions.searchUpdate.map(R.prop('searchResults')).toProperty(init),
      string: (init = '') => actions.searchUpdate.map(R.prop('searchString')).toProperty(init),
      loading: actions.searchUpdate.waiting
    },
    route: actions.setRouteState
  };
};
