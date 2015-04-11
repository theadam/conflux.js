var React = require('react');

module.exports = React.createClass({
  getInitialState() {
    return {
      count: 1
    };
  },
  handleClick: function(action){
    action.push(this.state.count);
    this.setState({count: this.state.count + 1});
  },
  render: function(){
    return (
      <div>
        <button onClick={() => this.handleClick(this.props.actions.value.request)}>Press</button>
        <button onClick={() => this.handleClick(this.props.actions.value2.request)}>Press2</button>
        <div>{this.props.loading ? 'Loading...' : this.props.data.join(', ')}</div>
      </div>
    );
  }
});
