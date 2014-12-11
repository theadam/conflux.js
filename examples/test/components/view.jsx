var React = require('react');
var Conflux = require('../../../');
var stores = require('../stores/stores.js');
var actions = require('../actions/actions.js');
var R = require('ramda');

module.exports = React.createClass({
  mixins: [Conflux.Mixin()],
  confluxState: {
    data: stores.data,
    loading: stores.loading
  },
  getInitialState: function(){
    return {
      count: 1
    };
  },
  handleClick: function(){
    actions.action(this.state.count);
    this.setState({count: this.state.count + 1});
  },
  render: function(){
    return (
      <div>
        <button onClick={this.handleClick}>Press</button>
        <div>{this.state.loading ? 'Loading...' : this.state.data.join(', ')}</div>
      </div>
    );
  }
});
