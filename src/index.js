import React from 'react';
import PropTypes from 'prop-types';
import {GlobalStoreContext} from './context';
import produce from 'immer';
import ObjectSchemaForm from './object-schema-form';
import ArraySchemaForm from './array-schema-form'
import {Button} from 'antd'
import './index.scss'
import getName from  './locale'
import {moveArrayItemAction, 
  setValueByPathAction, 
  addArrayItemByPathAction,
  deleteArrayItemByPathAction
} from './model'
import watchProps from './hoc/watchProps'
import widgets, {handleDefault} from './widgets'

const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true, jsonPointers: true});
// Ajv options allErrors and jsonPointers are required
require('ajv-errors')(ajv /*, {singleError: true} */);

export function addWidget(name, component){
  widgets[name] = handleDefault()(component);
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
    window.__jsf_locale = this.props.locale;
  }

  static propTypes = {
    schema: PropTypes.object,
    value: PropTypes.any,
    onChange: PropTypes.func,
    dataPath: PropTypes.array,
    onBlur: PropTypes.func,
    enableSumbit: PropTypes.bool,
    getOpenValiteApi: PropTypes.func,
    locale: PropTypes.oneOf(['zh_CN', 'en_US']),
    enableOnBlurValite: PropTypes.bool,
  };

  static defaultProps = {
    dataPath: [],
    enableSumbit: false,
    locale: 'zh_CN',
    enableOnBlurValite: true
  };

  watch = {
    value: function(newVal){
      this.setState(state=>{
        return {
          store: {
            ...state.store,
            value: newVal
          }
        }
      })
    }
  }

  moveArrayItem =(paths, from, to)=>{
    this.changeStore(store=>{
      moveArrayItemAction(store, {
        paths, 
        from,
        to
      }, this.state.store)
    })
  }

  setValueByPath =(paths, value)=>{
    this.changeStore((store=>{
      setValueByPathAction(store, {paths, value})
    }))
  }

  addArrayItemByPath =(paths, index , value = {})=>{
    this.changeStore(store=>{
      addArrayItemByPathAction(store, {
        paths, 
        index , 
        value
      })
    })
  }
  
  deleteArrayItemByPath =(paths, index)=>{
    this.changeStore(store=>{
      deleteArrayItemByPathAction(store, {
        paths,
        index
      })
    })
  }

  handleSumbit = ()=>{
    const newStore = this.state.store;
    this.props.onChange(newStore.value)
  }

  changeStore = (fn, cb) => {
    let newStore;
    this.setState (state => {
      newStore = produce (state.store, draftState => {
        if (typeof fn === 'function') {
          fn (draftState, state.store);
        }
      })
      return {
        store: newStore,
      };
    }, ()=>{
      if(cb){
        cb()
      }
      const {enableSumbit} = this.props;
      if(!enableSumbit){
        this.props.onChange(newStore.value)
      }
    });
  };

  getErrors = ()=>{
    return this.state.store.validateResult;
  }

  openApi = {
    getErrors: this.getErrors
  }

  _getOpenValiteApi = (fn)=>{
    if(fn){
      fn(this._valiteData)
    }
  }

  _valiteData = ()=>{
    const {schema} = this.props;
    const {store} = this.state;
    const validate = ajv.compile(schema);
    const valid = validate(store.value);
    return new Promise((resolve=>{
      if (!valid){
        this.changeStore(store=>{
          const errors = validate.errors.map(item=>{
            if(item.keyword === 'errorMessage'){
              let error = item.params.errors[0];
              return {
                ...item,
                keyword: error.keyword,
                params: {
                  ...(error.params || {})
                }
              }
            }else{
              return item;
            }
          }).map(item=>{
            if(item.keyword === 'required'){
              return {
                ...item,
                dataPath: item.dataPath +`.${item.params.missingProperty}`
              }
            } 
            return item;
          })
          store.validateResult = errors;
        }, ()=>{
          resolve(this.getErrors())
        })
      }else{
        this.changeStore(store=>{
          store.validateResult = [];
        }, ()=>{
          resolve([])
        })
      }
    }))
  }

  valiteData = ()=>{
    if(!this.props.enableOnBlurValite){
      return;
    }
    /**
     * 因 blur 后，部分组件存在异步的 setState 调用，所以这里需要延时处理
     */
    setTimeout(()=>{
      this._valiteData()
    }, 1000)
  }

  render () {
    const {className = '', schema, dataPath, enableSumbit} = this.props;
    const {store} = this.state;
    let C;
    if (schema.type === 'object') {
      C = ObjectSchemaForm;
    } else if (schema.type === 'array') {
      C = ArraySchemaForm;
    } else {
      throw new Error ('Not Support Type');
    }

    this._getOpenValiteApi(this.props.getOpenValiteApi)

    return (
      <GlobalStoreContext.Provider value={this.state}>
        <div className={`json-schema-form ${className}`}>
          {
            <C
              dataPath={dataPath}
              schema={schema}
              value={store.value}
              onBlur={this.valiteData}
            />
          }
          {enableSumbit && <div className="item-sumbit">
            <Button onClick={this.handleSumbit} size="large" type="primary">{getName('submit')}</Button>
          </div>}
        </div>
      </GlobalStoreContext.Provider>
    );
  }
}
