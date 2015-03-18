var React = require('react/addons');
var slug = require('to-slug-case');
var Conflux = require('../../../../');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var DocumentTitle = require('react-document-title');
var Link = require('react-router').Link;

var SearchResults = React.createClass({
  mixins: [Conflux.Mixin({search: ['results', 'string']})],

  statics: {
    initialize: (state, flux) => {
      if(flux.stores.search.string.get() === state.params.query) return Promise.resolve();
      else{
        return new Promise((res) => {
          flux.stores.search.string.changes().take(1).onValue(res);
          flux.actions.searchUpdate(state.params.query);
        });
      }
    }
  },

  render: function() {
    var results = [];
    if(this.state.search.results.length) {
      this.state.search.results.forEach(function(game) {
        if(game.image) {
          var params = {game_id: game.id, game_slug: slug(game.name)};
          results.push(
            <div key={game.id} className="search-result clearfix">
              <div className="search-image">
                <Link to='game' params={params}><img src={game.image.icon_url} alt={game.name} /></Link>
              </div>
              <h2 className="search-title"><Link to='game' params={params}>{game.name}</Link></h2>
            </div>
          );
        }
      });
    }
    else {
      results.push(<div key="no-results" className="no-results">No Games Matching {this.state.search.string}</div>);
    }
    var searchTitle = 'Search: ' + this.state.search.string;
    return (
      <DocumentTitle title={searchTitle}>
        <div className="search-results clearfix">
          <ReactCSSTransitionGroup component="div" transitionName="css-transition">
            {results}
          </ReactCSSTransitionGroup>
        </div>
      </DocumentTitle>
    );
  }
});

  module.exports = SearchResults
