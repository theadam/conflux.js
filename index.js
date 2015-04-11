import Conflux from './src/conflux'
import Mixin from './src/react/mixin'
import Component from './src/react/component'
import asyncAction from './src/utils/asyncAction'

module.exports = {
  Mixin,
  Component,
  asyncAction,
  with(Bacon){
    Conflux.Bacon = Bacon;
    return {
      create(){
        return Conflux.apply(this, arguments);
      }
    };
  }
};
