
module.exports = function initializeRoutes(routes, state, flux){
  return Promise.all(
    routes.map((route) => route.handler.initialize)
      .filter((method) => typeof method === 'function')
      .map((method) => method(state, flux)));
};
