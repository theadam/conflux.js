import Bacon from 'baconjs'
import {collectWithTimes, createStream} from './utils'
import _ from 'lodash'
import Immutable from 'immutable'

const mapMarble = fn => inputs => inputs.map(input => input.map(fn));

export default function(actions){
  let display = actions.evaluate.map((descriptor) => descriptor.get('display'));
  let fn = actions.evaluate.map((descriptor) => descriptor.get('fn'));

  // input in the form of [[{time..., value...., index....}, ...], ...]
  let inputs = Bacon.update(undefined,
    actions.evaluate, (prev, descriptor) => descriptor.get('inputs'),
    actions.changeInput, (prev, [inputIndex, marbleIndex, newMarble]) => prev.set(inputIndex, prev.get(inputIndex).set(marbleIndex, newMarble))
  ).changes();

  // stream that emits an array of streams that emit each descriptor at the descriptors listed time
  let inputStreams = inputs
    .map(inputs => inputs.toJS().map(createStream));

  let output = inputStreams
    .combine(fn, (streams, fn) => [streams, fn])
    .map(([streams, fn]) => fn.apply(fn, streams))
    .flatMap((stream) => Bacon.fromCallback(collectWithTimes, () => stream))
    .toProperty([])
    .map(Immutable.fromJS);

  return {
    mouseMoves: Bacon.fromEvent(window, 'mousemove')
      .merge(Bacon.fromEvent(window, 'touchmove')),
    mouseUps: Bacon.fromEvent(window, 'mouseup')
      .merge(Bacon.fromEvent(window, 'touchend')),
    diagram: {
      inputs,
      display,
      fn,
      output
    }
  };
};
