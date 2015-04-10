import Bacon from 'baconjs'
import Immutable from 'immutable'
import _ from 'lodash'

export default function(){
  return {
    showDiagram: new Bacon.Bus(),
    changeInput: new Bacon.Bus()
  };
}
