import Bacon from 'baconjs'
import {collectWithTimes, createStream} from './utils'
import _ from 'lodash'
import Immutable from 'immutable'
import descriptorFromPath, {descriptors, defaultPath} from './utils/descriptors'

const mapMarble = fn => inputs => inputs.map(input => input.map(fn));

export {defaultPath};

export default function(actions){

  let descriptor = actions.showDiagram.map(descriptorFromPath).skipDuplicates();

  let display = descriptor.map(descriptor => descriptor.get('display'));
  let fn = descriptor.map(descriptor => descriptor.get('fn'));

  let inputs = Bacon.update(undefined,
    descriptor, (prev, descriptor) => descriptor.get('inputs'),
    actions.changeInput, (prev, [inputIndex, marbleIndex, newMarble]) => prev.setIn([inputIndex, marbleIndex], newMarble)
  );

  // stream that emits an array of streams that emit each descriptor at the descriptors listed time
  let inputStreams = inputs
    .map(inputs => inputs.map(createStream));

  let output = inputStreams
    .combine(fn, (streams, fn) => fn.apply(fn, streams.toArray()))
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
    },
    descriptors: Bacon.constant(descriptors)
  };
};
