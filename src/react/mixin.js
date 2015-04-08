var React = require('react');
var PropTypes = React.PropTypes;
var _ = require('lodash');
var Conflux = require('../conflux');

var getModel = require('./utils/getModel');

function ConfluxMixin() {
  var args = Array.prototype.slice.call(arguments);
  return {
    contextTypes: {
      flux: PropTypes.instanceOf(Conflux)
    },

    childContextTypes: {
      flux: PropTypes.instanceOf(Conflux)
    },

    propTypes: {
      listenTo: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
        PropTypes.object
      ]),
      flux: PropTypes.instanceOf(Conflux)
    },

    getFlux(){
      return this.props.flux || this.context.flux;
    },

    listenTo(){
      var stores = arguments.length > 1 ? Array.prototype.slice.call(arguments) : arguments[0];
      if(stores.length > 0){
        var model = getModel(this.flux.stores, stores);
        this._listeners.push(
          model.changes().onValue((state) => this.setState(state))
        );
        return model.value;
      }
      return null;
    },

    eventStream(name){
      let bus = new Conflux.Bacon.Bus();
      this[name] = (event) => bus.push(event);
      return bus;
    },

    connectToState(key, stream){
      let disconnect = stream.onValue((val) => this.setState({[key]: val}));
      this._listeners.push(disconnect);
    },

    initialize(){
      this._listeners = [];
      this.flux = this.getFlux();
      if(this.flux){
        this.actions = this.flux.actions;
        this.stores = this.flux.stores;
      }
    },

    getInitialState(){
      this.initialize();
      return this.listenTo(args);
    },

    componentWillUnmount(){
      _.forEach(this._listeners, (listener) => listener());
    }
  };
}

module.exports = ConfluxMixin;
