import {isEqual} from 'lodash'

const hasOwn = Object.prototype.hasOwnProperty

function is(x, y) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y
  } else {
    return x !== x && y !== y
  }
}

function shallowEqual(objA, objB) {
  if (is(objA, objB)) return true

  if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
    return false
  }

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) return false

  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) ||
        !is(objA[keysA[i]], objB[keysA[i]])) {
      return false
    }
  }

  return true
}

export function getData (state, key) {
  let keys = key.split('.');
  let curState = state;
  for (let i = 0; i < keys.length; i++) {
    if(keys[i].indexOf('[') > 0 && keys[i].indexOf(']') > 0){
      throw new Error('watchProps 不支持数组path，比如 a[0]')
    }
    curState = curState[keys[i]];
  }
  return curState;
}

function getParams (state, props = {}) {
  let watch = state.__watchObject;
  if(watch && typeof watch === 'object'){
    let params = {};
    Object.keys (watch).forEach(key => {
      params[key] = getData(props, key)
    });
    return params;
  }
}

/**
 * 原理：反向继承包裹的组件
 * @param {*} Wrap 
 */
export default function WatchCreator(Wrap){
  return class extends Wrap{
    constructor(props) {
      super(props);
      let __watchObject = typeof this.watch === 'function' ? this.watch.call(this) : this.watch;
      this.state = {
        ...this.state,
        __watchObject
      }
    }

    static getDerivedStateFromProps (nextProps, prevState) {
      let result = {}
      let params = getParams(prevState, nextProps);
      let __watchObject = prevState.__watchObject;
      if(!params || !__watchObject){
        result = null;
      }else if(!prevState.__watchState){
        result = {
          __watchState: params,
        }
      }else if(!shallowEqual(params, prevState.__watchState)){
        result = {
          __watchState: params,
        };
      }
      
      if(typeof super.getDerivedStateFromProps === 'function'){
        let state =super.getDerivedStateFromProps(nextProps, prevState)
        return {
          ...result,
          ...state
        }
      }

      return result;
    }
  
    componentDidUpdate (...args) {
      let prevProps = args[0]
      let params = this.state.__watchState;
      let watchObject = this.state.__watchObject;
      if(!watchObject || !params){
        return;
      }
      Object.keys(watchObject).forEach(key=>{
        
        let prevValue = getData(prevProps, key)
        let enableDeep = true;
        let hander = watchObject[key];

        if(watchObject && typeof watchObject[key] === 'object'){
          hander = watchObject[key].hander;
          enableDeep = watchObject[key].deep === false ? false : true;
        }

        let equalFunction = enableDeep ? isEqual : shallowEqual;
        if(!equalFunction(params[key], prevValue)){
          if(hander && typeof hander === 'function'){
            hander.call(this, params[key], prevValue)
          }
        }
      })
      if(typeof super.componentDidUpdate === 'function'){
        super.componentDidUpdate.apply(this, args)
      }
      
    }


  }
}