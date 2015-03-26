import Conflux from './src/conflux'
import Mixin from './src/react/mixin'
import Component from './src/react/component'


module.exports = {
  Mixin,
  Component,
  with(Bacon){
    Conflux.Bacon = Bacon;
    return {
      create(){
        return Conflux.apply(this, arguments);
      }
    };
  }
};
