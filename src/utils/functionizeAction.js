
export default function functionizeAction(action){
  let push = action.push;
  push.plug = action.plug;
  return push;
}
