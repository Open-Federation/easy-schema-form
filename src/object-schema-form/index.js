import React from 'react';
import PropTypes from 'prop-types';
import './index.scss'
import ArraySchemaForm from '../array-schema-form'
import {GlobalStoreContext} from '../context';
import withContext from '../withContext'
import {getErrorMessage, getComponent, schemaHander} from '../utils'
import ObjectSchemaForm from './'
import FieldComponent from '../fields'
import {Tooltip, Icon} from 'antd'

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
    value: {},
    dataPath: [],
    schemaPath: []
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
    return <div className="object-schema-form-item" key={key} >
      <div className="item-label">
        {schema.description && <Tooltip placement="rightTop" title={<div dangerouslySetInnerHTML={{__html: schema.description}} className="description"></div>}>
          {schema.title}&nbsp;
          <Icon type="question-circle" theme="outlined" />
        </Tooltip>}
        {!schema.description && schema.title}
        {isRequired && <span style={{color: 'red'}}>*</span>}
      </div>
      <div className="item-wrap">
        {el}
        {errorMessage && <div className="error-message">
          {errorMessage}
        </div>}
      </div>
    </div>
  }

  render(){
    const {value, schema, dataPath, __context} = this.props;
    const {store} = __context;

    const {properties} = schema;
    return <div className="object-schema-form">
      {Object.keys(properties).map(key=>{
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
      })}
      
    </div>
  }
}