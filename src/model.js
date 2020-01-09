function getData(state, keys) {
  try{
    let curState = state;
    for (let i = 0; i < keys.length; i++) {
      curState = curState[keys[i]];
    }
    return curState;
  }catch(e){
    return null;
  }
}

function setData(state, keys, value) {
  let curState = state;
  for (let i = 0; i < keys.length - 1; i++) {
    curState = curState[keys[i]];
  }
  curState[keys[keys.length - 1]] = value;

}

function arrMove(arr, fromIndex, toIndex) {
  arr = [].concat(arr);
  let item = arr.splice(fromIndex, 1)[0];
  arr.splice(toIndex, 0, item);
  return arr;
}

export function moveArrayItemAction(draftStore, params = {}, store){
  const {paths, from, to} = params;
  const arr = getData(store.value, paths);
  const newArr = arrMove(arr, from ,to)
  if(paths.length === 0){
    return draftStore.value = newArr;
  }
  setData(draftStore.value, paths, newArr)
}

export function setValueByPathAction(store, params = {}){
  const {paths, value} = params;
  if(paths.length === 0){
    return store.value = value;
  }
  setData(store.value, paths, value)
}

export function addArrayItemByPathAction(store, params = {}){
  const {paths, index , value = {}} = params;
  const arr = getData(store.value, paths);
  if(typeof index === 'undefined'){
    arr.push(value)
  }else arr.splice(index + 1, 0, value)
}

export function deleteArrayItemByPathAction(store, params = {}){
  const {paths, index} = params;
  const arr = getData(store.value, paths);
  arr.splice(index, 1)
}