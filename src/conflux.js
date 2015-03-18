var _ = require('lodash');
var project = require('./utils/project');
var Bacon = require('bacon.model');
var Stores = require('./stores');

function Conflux(actions, stores, initialValues){
  if(!(this instanceof Conflux)) return new Conflux(actions, stores, initialValues);
  if(actions instanceof Function){
    this.actions = actions();
  }
  else{
    this.actions = Conflux.Actions(actions);
  }
  this.stores = Stores(stores(this.actions), initialValues);
  this.actions = project(this.actions, 'push');
}

Conflux.combine = Bacon.Model.combine;

Conflux.prototype.serialize = function(){
  return Conflux.combine(this.stores).get();
};

_.merge(Conflux, require('./actions'));

Conflux.Bacon = Bacon;

module.exports = Conflux;
