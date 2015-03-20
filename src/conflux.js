var _ = require('lodash');
var project = require('./utils/project');
var Bacon = require('baconjs');
var Stores = require('./stores');
var combine = require('./utils/combine');
var Actions = require('./actions');

function Conflux(actions, stores, initialValues){
  if(!(this instanceof Conflux)) return new Conflux(actions, stores, initialValues);
  if(actions instanceof Function){
    this.actions = actions();
  }
  else{
    this.actions = Actions.Actions(actions);
  }
  this.stores = Stores(stores(this.actions), initialValues);
  this.actions = project(this.actions, 'push');
}

Conflux.combine = combine;

Conflux.prototype.serialize = function(){
  return Conflux.combine(this.stores).value;
};

_.merge(Conflux, require('./actions'));

Conflux.Bacon = Bacon;

module.exports = Conflux;
