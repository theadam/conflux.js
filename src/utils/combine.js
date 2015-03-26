import Conflux from '../conflux'
import wrapProperty from './wrapProperty'

export default function combine(stores){
  return wrapProperty(Conflux.Bacon.combineTemplate(stores));
}
