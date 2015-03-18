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
var initializeRoutes = require('../../utils/initializeRoutes');
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
        <title>%document_title_placeholder%</title>
      <meta charSet="UTF-8" />
      <link href="http://fonts.googleapis.com/css?family=Merriweather+Sans:800" rel="stylesheet" type="text/css" />
      <link rel="stylesheet" type="text/css" href="http://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.1/normalize.min.css" />
      <link rel="stylesheet" type="text/css" href="/css/style.css" />
      </head>
      <body>
        <Global values={{[stateKey]: this.props.state}} />
        <Conflux.Component flux={this.props.flux} listenTo={['route', 'search']} >
          <Search onSearch={this.searchGames} />
        </Conflux.Component>
        <DocumentTitle title="%document_title_placeholder%">
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
  routes: routes,
  title: DocumentTitle
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


      initializeRoutes(state.routes, state, flux)
        .then(() => {
          React.render(<Handler flux={flux} state={serverState} />, document);
        })
        .catch((e) => {throw e; });
    });

  };
}
