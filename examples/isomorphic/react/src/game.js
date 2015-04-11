var React = require('react/addons');
var slug = require('to-slug-case');
var DocumentTitle = require('react-document-title');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var Link = require('react-router').Link;

var Conflux = require('../../../../');

var Game = React.createClass({
  mixins: [Conflux.Mixin('game')],

  statics: {
    initialize(state, flux){
      var currentGame = flux.stores.game.results.value;
      if(currentGame && String(currentGame.id) === state.params.game_id) return Promise.resolve();
      var promise = flux.stores.game.results.changes().firstToPromise();
      flux.actions.game.request.push(state.params.game_id);
      return promise;
    }
  },

  getURI: function(game_id, game_name) {
    return '/game/' + game_id + '/' + slug(game_name);
  },

  beginImageLoad: function() {
    this.refs.gameImage.getDOMNode().className += ' hide';
    this.refs.gameTitle.getDOMNode().className += ' hide';
    this.refs.gameDeck.getDOMNode().className += ' hide';
  },

  confirmImageLoad: function() {
    this.refs.gameImage.getDOMNode().className = 'game-image';
    this.refs.gameTitle.getDOMNode().className = 'game-title';
    this.refs.gameDeck.getDOMNode().className = '';
  },

  render: function() {
    let related = null;
    if(this.state.game.results.similar_games && this.state.game.results.similar_games.length) {
      var relatedGames = [];
      var self = this;
      this.state.game.results.similar_games.forEach(function(game) {
        var gameKey = 'related-' + game.id;
        relatedGames.push(<li key={gameKey}><Link onClick={self.beginImageLoad} to='game' params={{game_id: game.id, game_slug: slug(game.name)}}>{game.name}</Link></li>);
      });
      related = (
        <div key="game-related" className="game-related">
          <h3>Similar Games</h3>

          <ReactCSSTransitionGroup component="ul" transitionName="css-transition">
            {relatedGames}
          </ReactCSSTransitionGroup>

        </div>);
    }
    return (
      <DocumentTitle title={this.state.game.results.name}>
        <div key="game-detail" className="game-detail clearfix">
          <h1 ref="gameTitle" key="game-title" className="game-title">{this.state.game.results.name}</h1>
          <div key="game-info" className="game-info">
            <p ref="gameDeck" key="game-deck">{this.state.game.results.deck}</p>
            {related}
          </div>
          <div key="game-image-container" className="game-image-container">
            <img className="game-image" ref="gameImage" onLoad={this.confirmImageLoad} key="game-image" src={this.state.game.results.image.medium_url} alt={this.state.game.results.name} />
          </div>
        </div>
      </DocumentTitle>
    );
  }

});


module.exports = Game;
