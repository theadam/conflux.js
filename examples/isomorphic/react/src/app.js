var React = require('react/addons');
var Router = require('react-router');
var DocumentTitle = require('react-document-title');

var Search = require('./search');
var SearchResults = require('./searchResults');
var Game = require('./game');
var Home = require('./home');
var Conflux = require('../../../../');
var actions = require('./actions');
var stores = require('./stores');
var Global = require('react-global');
var stateKey = '__confluxState';

var Route = Router.Route;
var RouteHandler = Router.RouteHandler;


var App = React.createClass({

  searchGames: function(query) {
    this.props.flux.actions.routeTo('/search/' + encodeURI(query));
  },

  render: function() {
    return (
      <html>
      <head>
        <title>%react-iso-vgs%</title>
      <meta charSet="UTF-8" />
      <link href="http://fonts.googleapis.com/css?family=Merriweather+Sans:800" rel="stylesheet" type="text/css" />
      <link rel="stylesheet" type="text/css" href="http://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.1/normalize.min.css" />
      <link rel="stylesheet" type="text/css" href="/css/style.css" />
      </head>
      <body>
        <Global values={{[stateKey]:this.props.state}} />
        <a href="https://github.com/chadpaulson/react-isomorphic-video-game-search"><img className="github-ribbon" src="https://camo.githubusercontent.com/a6677b08c955af8400f44c6298f40e7d19cc5b2d/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f677261795f3664366436642e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png" /></a>
        <Conflux.Component flux={this.props.flux} listenTo={['route', {search: ['string', 'loading']}]} >
          <Search onSearch={this.searchGames} />
        </Conflux.Component>
        <DocumentTitle title="%react-iso-vgs%">
          <RouteHandler flux={this.props.flux}/>
        </DocumentTitle>
        <script src="/app.js" type="text/javascript" />
      </body>
      </html>
    );
  }

});

var routes = (
  <Route handler={App} >
    <Route name="home" path="/" handler={Home} />
    <Route name="game" path="/game/:game_id/:game_slug" handler={Game} />
    <Route name="search" path="/search/:query" handler={SearchResults} />
  </Route>
);

module.exports = {
  routes: routes
};


// Bootstrap client
if (typeof window !== 'undefined') {
  window.onload = function() {
    var serverState = Global.get(stateKey);

    var flux = Conflux(actions, stores, serverState);

    var router = Router.create({
      routes,
      location: Router.HistoryLocation
    });

    flux.actions.setRouter(router);

    router.run(function(Handler, state){
      flux.actions.setRouteState(state);

      Promise.all(
        state.routes.map((route) => route.handler.initialize)
          .filter((method) => typeof method === 'function')
          .map((method) => method(state, flux)))
        .then(() => {
          React.render(<Handler flux={flux} state={serverState} />, document);
        })
        .catch((e) => {throw e});
    });

  };
}
