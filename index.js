var Bacon = require('baconjs');
var _ = require('lodash');

var Conflux = {
  createAction: function(){
    var bus = new Bacon.Bus();
    var push = bus.push.bind(bus);
    _.extend(push, bus);
    _.extend(push, Bacon.EventStream.prototype);
    _.extend(push, Bacon.Observable.prototype);
    return push;
  },

  createActions: function(list){
    var actions = {};
    for(var i = 0; i < list.length; i++){
      actions[list[i]] = Conflux.createAction();
    }
    return actions;
  },

  Mixin: function(name){
    name = name || 'confluxState';
    return {
      componentWillMount: function(){
        if(this[name]){
          this._unsubscribe = Bacon.combineTemplate(this[name]).onValue(function(state){
            this.setState(state);
          }.bind(this));
        }
      },
      componentWillUnmount: function(){
        if(this._unsubscribe){
          this._unsubscribe();
        }
      }
    };
  }
};

module.exports = Conflux;
