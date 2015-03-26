import expect from 'expect.js'
import isAction from '../../utils/isAction'

export default function validAction(action){
  expect(isAction(action)).to.be(true);
}
