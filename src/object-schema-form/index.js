import React from 'react';
import PropTypes from 'prop-types';
import './index.scss'
import ArraySchemaForm from '../array-schema-form'
import {GlobalStoreContext} from '../context';
import withContext from '../withContext'
import {getErrorMessage, getComponent, schemaHander} from '../utils'
import ObjectSchemaForm from './'
import FieldComponent from '../fields'
import {Tooltip, Tabs} from 'antd'
import { Icon } from '@ant-design/compatible';
import getName from '../locale'

const defaultGroup = getName('default_group_name')

@withContext(GlobalStoreContext)
export default  class _ObjectSchemaForm extends React.PureComponent{

  static propTypes = {
    form: PropTypes.object,
    value: PropTypes.object,
    schema: PropTypes.object,
    dataPath: PropTypes.array,
    onBlur: PropTypes.func,
    __context: PropTypes.object
  }

  static defaultProps = {
    dataPath: [],
    schemaPath: []
  }

  constructor(props){
    super(props)
    const {__context, dataPath} = this.props;
    const {setValueByPath} = __context;
    if(!this.props.value){
      setValueByPath([...dataPath], {})
    }
    this.state = {
      curTabKey: defaultGroup
    }
  }

  handleChange = (key)=> (e)=>{
    let value = e;
    if (
      e &&
      typeof e === 'object' &&
      e.target &&
      typeof e.target === 'object'
    ) {
      value = e.target.value;
    }
    const {__context, dataPath} = this.props;
    const {setValueByPath} = __context;
    const paths = [...dataPath, key]
    setValueByPath(paths, value)
  }

  _ObjectKeyRender = (key) => ({
    el, 
    errorMessage,
    schema,
    isRequired
  })=>{
    const ui = schema.ui || {};
    let {showLabel = true} = ui; 
    return <div className="object-schema-form-item" key={key} >
      {showLabel && <div className="item-label">
        {schema.description && <Tooltip placement="rightTop" title={<div dangerouslySetInnerHTML={{__html: schema.description}} className="description"></div>}>
          {schema.title || key}&nbsp;
          <Icon type="question-circle" theme="outlined" />
        </Tooltip>}
        {!schema.description && (schema.title || key)}
        {isRequired && <span style={{color: 'red'}}>*</span>}
      </div>}
      <div className="item-wrap">
        {el}
        {errorMessage && <div className="error-message">
          {errorMessage}
        </div>}
      </div>
    </div>
  }

  getMulitSchema(schema){
    const schemas = {}
    Object.keys(schema.properties).forEach(key=>{
      let item = schema.properties[key];
      let categoryName = item.categoryName || defaultGroup;
      schemas[categoryName] = schemas[categoryName] || {
        ...schema,
        properties: {}
      };
      schemas[categoryName].properties[key] = item;
    })
    return schemas;
  }

  render(){
    const {schema, value} = this.props;
    if(!value){
      return null;
    }
    const mulitSchems = this.getMulitSchema(schema);
    const keys = Object.keys(mulitSchems);
    return <div className="object-schema-form">
      {keys.length > 1 && <Tabs onChange={(key=>{
        this.setState({
          curTabKey: key
        })
      })} activeKey={this.state.curTabKey} defaultActiveKey={defaultGroup} >
        {keys.map(key=>
          <Tabs.TabPane tab={key} key={key}>
          </Tabs.TabPane>
        )}
      </Tabs>}
      {keys.length === 1 && this.renderSchema(mulitSchems[keys[0]])}
      {keys.length > 1 && this.renderSchema(mulitSchems[this.state.curTabKey])}
      
    </div>
  }

  renderSchema(schema){
    const {properties} = schema;
    return Object.keys(properties).map(key=>{
      const {value, dataPath, __context} = this.props;
      const {store} = __context;
      const itemInfo = properties[key];
        
      let C = FieldComponent;

      const schema = schemaHander(itemInfo, {
        record: this.props.value,
        formData: store.value,
      })

      const ui = (schema.ui || {});

      if(ui.hide)return null;

      if(itemInfo.type === 'array' && itemInfo.items && itemInfo.items.type === 'object'){
        C = ArraySchemaForm;
      }else if(itemInfo.type === 'object'){
        C = ObjectSchemaForm;
      }else{
        C = getComponent(FieldComponent, itemInfo);
      }
      
      const {validateResult} = store;
      let errorMessage = getErrorMessage([...this.props.dataPath, key], validateResult)
      let isRequired = false;

      if(Array.isArray(schema.required) && schema.required.indexOf(key) !== -1){
        isRequired = true;
      }

      const el = <C
        {...ui.options}
        default={itemInfo.default} 
        value={value[key]} 
        onChange={this.handleChange(key)} 
        changeParentData={(key, value)=>{
          this.handleChange(key)(value)
        }}
        schema={itemInfo} 
        dataPath={[...dataPath, key]}
        onBlur={this.props.onBlur}
      />

      const objectKeyRender = this._ObjectKeyRender(key);

      return objectKeyRender({
        schema: itemInfo,
        el,
        errorMessage,
        isRequired,
        type: 'object-item'
      })
    })
  }
}