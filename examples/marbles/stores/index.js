import Bacon from 'baconjs'
import {collectWithTimes, createStream} from './utils'
import _ from 'lodash'

const mapMarble = fn => inputs => inputs.map(input => input.map(fn));
const addIndex = (item, index) => _.merge({index}, item);

export default function(actions){
  let display = actions.evaluate.map((descriptor) => descriptor.display);
  let fn = actions.evaluate.map((descriptor) => descriptor.fn);

  // input in the form of [[{time..., value...., index....}, ...], ...]
  let inputs = Bacon.update(undefined,
    actions.evaluate, (prev, {inputs}) => mapMarble(addIndex)(inputs),
    actions.changeInput, (prev, [indexToChange, newInput]) => prev.map((old, index) => index === indexToChange ? newInput : old)
  ).changes();

  // stream that emits an array of streams that emit each descriptor at the descriptors listed time
  let inputStreams = inputs
    .map(inputs => inputs.map(createStream));

  let output = inputStreams
    .combine(fn, (streams, fn) => [streams, fn])
    .map(([streams, fn]) => fn.apply(fn, streams))
    .flatMap((stream) => Bacon.fromCallback(collectWithTimes, () => stream))
    .toProperty([])
    .map(outputs => outputs.map(addIndex))
    .log();

  return {
    mouseMoves: Bacon.fromEvent(window, 'mousemove').filter(e => e),
    mouseUps: Bacon.fromEvent(window, 'mouseup').filter(e => e),
    diagram: {
      inputs,
      display,
      fn,
      output
    }
  };
};
