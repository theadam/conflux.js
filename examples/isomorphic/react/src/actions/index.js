var R = require('ramda');
var Bacon = require('bacon.model');

var Conflux = require('../../../../../');
var api = require('../api');

module.exports = function createActions(){
  var setRouter = Conflux.Action();
  var router = setRouter.toProperty();

  var routeTo = Conflux.Action();

  // side effect for changing route
  var routeRouter = routeTo
    .combine(router, (route, router) => {return {route, router}; });

  routeRouter.onValue(({route, router}) => {
    router.transitionTo.apply(router, [].concat(route));
  });

  return {
    loadGame: Conflux.PromiseAction(R.memoize(api.loadGameData)),
    //loadGame: Conflux.Action((bus) => bus.map(R.memoize(api.loadGameData)).flatMapLatest(Bacon.fromPromise)),
    searchUpdate: Conflux.PromiseAction(api.search),
    setRouter: setRouter,
    routeTo: routeTo,
    setRouteState: Conflux.Action()
  };
};
