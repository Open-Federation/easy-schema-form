import React from 'react';
import PropTypes from 'prop-types';
import {GlobalStoreContext} from './context';
import produce from 'immer';
import ObjectSchemaForm from './object-schema-form';
import ArraySchemaForm from './array-schema-form'
import {Button} from 'antd'
import './index.scss'
import getName from  './locale'
import watchProps from './common/watchProps'

const Ajv = require('ajv');
const ajv = new Ajv();

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

@watchProps
export default class JsonSchemaForm extends React.PureComponent {
  constructor (props) {
    super (props);
    this.state = {
      store: {
        value: props.value,
        validateResult: [],
      },
      changeStore: this.changeStore,
      setValueByPath: this.setValueByPath,
      addArrayItemByPath: this.addArrayItemByPath,
      deleteArrayItemByPath: this.deleteArrayItemByPath,
      moveArrayItem: this.moveArrayItem,
    };
  }

  static propTypes = {
    schema: PropTypes.object,
    value: PropTypes.any,
    onChange: PropTypes.func,
    dataPath: PropTypes.array,
    onBlur: PropTypes.func,
    enableSumbit: PropTypes.bool,
    locale: PropTypes.oneOf(['zh_CN', 'en_US'])
  };

  static defaultProps = {
    dataPath: [],
    enableSumbit: false,
    locale: 'en_US'
  };

  watch = {
    value: {
      deep: false,
      hander(v){
        this.changeStore(store=>{
          store.value = v
        })
      }
    }
  }

  moveArrayItem =(paths, from, to)=>{

    function arrMove(arr, fromIndex, toIndex) {
      arr = [].concat(arr);
      let item = arr.splice(fromIndex, 1)[0];
      arr.splice(toIndex, 0, item);
      return arr;
    }

    this.changeStore(store=>{
      const arr = getData(this.state.store.value, paths);
      const newArr = arrMove(arr, from ,to)
      if(paths.length === 0){
        return store.value = newArr;
      }
      setData(store.value, paths, newArr)
    })
  }

  setValueByPath =(paths, value)=>{
    this.changeStore((store=>{
      if(paths.length === 0){
        return store.value = value;
      }
      setData(store.value, paths, value)
    }))
  }

  addArrayItemByPath =(paths, index , value = {})=>{
    this.changeStore(store=>{
      const arr = getData(store.value, paths);
      if(typeof index === 'undefined'){
        arr.push(value)
      }else arr.splice(index + 1, 0, value)
    })
  }
  
  deleteArrayItemByPath =(paths, index)=>{
    this.changeStore(store=>{
      const arr = getData(store.value, paths);
      arr.splice(index, 1)
    })
  }

  changeStore = fn => {
    this.setState (state => {
      const {enableSumbit} = this.props;
      const newStore = produce (state.store, draftState => {
        if (typeof fn === 'function') {
          fn (draftState, state.store);
        }
      })
      if(!enableSumbit){
        this.props.onChange(newStore.value)
      }
      return {
        store: newStore,
      };
    });
  };

  render () {
    const {schema, dataPath, enableSumbit} = this.props;
    const {store} = this.state;
    let C;
    if (schema.type === 'object') {
      C = ObjectSchemaForm;
    } else if (schema.type === 'array') {
      C = ArraySchemaForm;
    } else {
      throw new Error ('Not Support Type');
    }
    return (
      <GlobalStoreContext.Provider value={this.state}>
        <div className="json-schema-form">
          {
            <C
              dataPath={dataPath}
              schema={schema}
              value={store.value}
              onBlur={ ()=> {
                const validate = ajv.compile(schema);
                const valid = validate(store.value);
                if (!valid){
                  this.changeStore(store=>{
                    const errors = validate.errors.map(item=>{
                      if(item.keyword === 'required'){
                        return {
                          ...item,
                          dataPath: item.dataPath +`.${item.params.missingProperty}`
                        }
                      }
                      return item;
                    })
                    store.validateResult = errors;
                  })
                }else{
                  this.changeStore(store=>{
                    store.validateResult = [];
                  })
                }
              }}
            />
          }
          {enableSumbit && <div className="item-sumbit">
            <Button size="large" type="primary">{getName('submit')}</Button>
          </div>}
        </div>
      </GlobalStoreContext.Provider>
    );
  }
}
