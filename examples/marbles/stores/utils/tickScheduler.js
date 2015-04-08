import _ from 'lodash'
import Bacon from 'baconjs'


let oldScheduler = Bacon.scheduler;
let counter = 1;
let currentTick = 0;
let schedule = {};
let toRemove = [];
let nextId = () => counter += 1;
let running = false;
let add = (delay, entry) => {
  let tick = currentTick + delay;
  entry.id = entry.id || nextId();
  schedule[tick] = schedule[tick] || [];
  schedule[tick].push(entry);
  return entry.id;
};
let boot = (id) => {
  if (!running){
    running = true;
    setTimeout(run, 0);
  }
  return id;
};
let run = () => {
  while(Object.keys(schedule).length){
    while(schedule[currentTick] && schedule[currentTick].length){
      let forNow = schedule[currentTick].splice(0);
      for(let entry of forNow){
        if(_.contains(toRemove, entry.id)){
          _.remove(entry.id, toRemove);
        }
        else{
          try{
            entry.fn();
          }
          catch(e){
            if(e !== 'testing') throw e;
          }
          if(entry.recur) add(entry.recur, entry);
        }
      }
      delete schedule[currentTick];
    }
    currentTick += 1;
  }
  currentTick = 0;
  running = false;
};

export default {
  setTimeout: (fn, delay) => boot(add(delay, {fn})),
  setInterval: (fn, recur) => boot(add(recur, {fn, recur})),
  clearTimeout: (id) => Bacon.mock ? oldScheduler.clearTimeout(id) : toRemove.push(id),
  clearInterval: (id) => Bacon.mock ? oldScheduler.clearInterval(id) : toRemove.push(id),
  now: () => Bacon.mock ? oldScheduler.now() : currentTick
};
