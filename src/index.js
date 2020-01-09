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

const Ajv = require('ajv');
const ajv = new Ajv();

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
    locale: PropTypes.oneOf(['zh_CN', 'en_US'])
  };

  static defaultProps = {
    dataPath: [],
    enableSumbit: false,
    locale: 'zh_CN'
  };

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

  valiteData = ()=>{
    /**
     * 因 blur 后，部分组件存在异步的 setState 调用，所以这里需要延时处理
     */
    setTimeout(()=>{
      const {schema} = this.props;
      const {store} = this.state;
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
    }, 100)
  }

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
