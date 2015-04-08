import Bacon from 'baconjs'
import tickScheduler from './tickScheduler'
import _ from 'lodash'

export function collect(srcFunc, done){
  let results = [];
  let oldScheduler = Bacon.scheduler;
  Bacon.scheduler = tickScheduler;
  let src = srcFunc();
  let sub = () => (event) => {
    if(event.isEnd()) {
      Bacon.scheduler = oldScheduler;
      return done(results);
    }
    results.push(event.value());
    src.subscribe(sub());
    return Bacon.noMore;
  };
  src.subscribe(sub());
}

export function collectWithTimes(src, done){
  collect(() => src().map(value => ({value, time: tickScheduler.now()})), done);
}

export function createStream(marbles){
  var streams = marbles.map((m) => Bacon.later(m.time, m.value));
  return Bacon.mergeAll(streams);
}
