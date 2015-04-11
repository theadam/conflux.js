var R = require('ramda');

var Bacon = require('baconjs');

var api = require('../api');

module.exports = function createActions(){
  var setRouter = new Bacon.Bus();
  var router = setRouter.toProperty();

  var routeTo = new Bacon.Bus();

  // side effect for changing route
  var routeRouter = routeTo.debounce(400)
    .combine(router, (route, router) => {return {route, router}; });

  routeRouter.onValue(({route, router}) => {
    router.transitionTo.apply(router, [].concat(route));
  });

  return {
    game: (bus) => bus.map(R.memoize(api.loadGameData)).flatMapLatest(Bacon.fromPromise),
    search: (bus) => bus.map(api.search).flatMapLatest(Bacon.fromPromise),
    setRouter: setRouter,
    routeTo: routeTo,
    setRouteState: new Bacon.Bus()
  };
};
