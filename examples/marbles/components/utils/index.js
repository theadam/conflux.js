import Bacon from 'baconjs'
import tickScheduler from './tickScheduler'

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
    results.push(event);
    src.subscribe(sub());
    return Bacon.noMore;
  };
  src.subscribe(sub());
}

export function collectWithTimes(src, done){
  collect(() => src().map((v) => [Bacon.scheduler.now(), v]), done);
}

export function createStream(marbles){
  var streams = marbles.map((m) => Bacon.later(m.x, m.val));
  return Bacon.mergeAll(streams);
}

export function mapLine(line){
  let id = 0;
  var keys = {};
  for (let key of Object.keys(line)){
    let value = Object.create(line[key]);
    value.id = id;
    keys[id] = value;
    id += 1;
  }
  return keys;
}
