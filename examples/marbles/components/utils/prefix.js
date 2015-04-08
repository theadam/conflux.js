
function capFirst(raw){
  return raw[0].toUpperCase() + raw.substr(1);
}

function getReactPrefix(pre){
  if(!pre) return undefined;
  else if(pre === 'ms') return pre;
  return capFirst(pre);
}

let styles = window.getComputedStyle(document.documentElement, '');
let rawPrefix = Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o']);
let reactPrefix = getReactPrefix(rawPrefix[1]);
export default function prefix(key){
  if(reactPrefix === undefined) return key;
  return reactPrefix + capFirst(key);
}
