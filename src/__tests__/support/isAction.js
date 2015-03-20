import expect from 'expect.js'
import Bacon from 'baconjs'

export default function isAction(action){
  expect(action).to.be.a(Bacon.Observable);
  expect(action.plug).to.be.a(Function);
  expect(action.push).to.be.a(Function);
  expect(action.waiting).to.be.a(Bacon.Property);
}
