var React = require('react/addons');
var _ = require('lodash');

var ConfluxComponent = React.createClass({
  mixins: [require('./mixin')()],

  componentWillMount(){
    this.listenTo(this.props.listenTo);
  },

  applyProps(child){
    return React.addons.cloneWithProps(child, this.getChildProps());
  },

  render(){
    var children = this.props.children;
    if (!children) return null;

    if(!_.isArray(children)){
      return this.applyProps(children);
    }
    else{
      return <span>{React.Children.map(children, this.applyProps)}</span>;
    }
  },

  getChildProps() {
    var flux = this.getFlux();
    return _.merge({flux}, {actions: flux.actions}, this.state);
  }

});

module.exports = ConfluxComponent;
