import React from 'react';
import PropTypes from 'prop-types';
import {Table, Button, Icon, Modal, Popconfirm, Input, Tooltip} from 'antd';
import ObjectSchemaForm from '../object-schema-form'
import {GlobalStoreContext} from '../context';
import withContext from '../withContext'
import {getErrorMessage, getComponent, schemaHander} from '../utils'
import './index.scss'
import FieldComponent from '../fields'
import {union, find} from 'lodash'
import getName from '../locale'

let _curIndex = null;

function isDom(obj) {
  return (
    obj &&
    typeof obj === 'object' &&
    obj.nodeType === 1 &&
    typeof obj.nodeName === 'string' &&
    typeof obj.getAttribute === 'function'
  );
}

class TableRow extends React.PureComponent{
  static propTypes = {
    customDragChange: PropTypes.func,
    'data-row-key': PropTypes.any
  }
  constructor(props){
    super(props)
    this.state = {
      draggable: false
    }
  }

  onDragStart = ()=>{
    _curIndex = this.props['data-row-key'];
  }

  onChange = (from, to) => {
    if (from === to) {
      return;
    }
    this.props.customDragChange(from, to)
  };

  onMouseDown = (e)=>{
    let el = e.target;
    for(let i=0; i< 4; i++){
      if(!isDom(el))return;
      if(el.getAttribute('is-drag') === 'true'){
        this.setState({
          draggable: true
        })
        break;
      }
      el = el.parentNode;
    }
  }

  onDragEnter = ()=>{
    let index = this.props['data-row-key'];
    this.onChange(_curIndex, index);
    _curIndex = index;
  }

  onDragEnd = ()=>{
    this.setState({
      draggable: false
    })
  }

  render(){
    const {draggable} = this.state;
    const {customDragChange, ...extraProps} = this.props; //eslint-disable-line
    return <tr 
      {...extraProps}  
      onDragStart={this.onDragStart}
      onDragEnd={this.onDragEnd}
      onDragEnter={this.onDragEnter}
      onMouseDown={this.onMouseDown}
      draggable={draggable}
    />
  }
}


@withContext(GlobalStoreContext)
export default class ArrayFieldForm extends React.PureComponent {
  constructor (props) {
    super (props);
    this.state = {
      modalVisible: false,
      fastEditModalVisible: false
    };

    const {__context, dataPath, value} = this.props;
    const {setValueByPath} = __context;
    if(!value || !Array.isArray(value)){
      setValueByPath([...dataPath], [])
    }
  }

  static propTypes = {
    schema: PropTypes.object,
    value: PropTypes.array,
    dataPath: PropTypes.array,
    onBlur: PropTypes.func,
    __context: PropTypes.object,
    uniqueField: PropTypes.string
  };

  static defaultProps = {
    dataPath: [],
  }

  handleChange = (key, index) => e => {
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
    const paths = [...dataPath, index, key]
    setValueByPath(paths, value)
  };

  renderModal(config){
    const {advFields = [], properties} = config.items;
    const formData = this.props.value || [];
    const {modalDataIndex} = this.state;
    const data = formData[modalDataIndex || 0];
    if(!data)return null;
    const {dataPath} = this.props;

    const schema = advFields.reduce((result, key)=>{
      result.properties[key] = properties[key]
      return result;
    }, {
      type: 'object',
      properties: {}
    }, [])

    if(!Array.isArray || advFields.length === 0){
      return null;
    }
    return <Modal 
      onCancel={()=>{
        this.setState({
          modalVisible: false
        })
      }}
      title={getName('advance-setting')}
      visible={this.state.modalVisible}
      footer={null}
      width={'100%'}
      maskClosable={false}
    >
      <div className="array-schema-form-adv-modal">
        <ObjectSchemaForm
          dataPath={[...dataPath, modalDataIndex]}
          schema={schema} 
          value={data} />
      </div>
    </Modal>
  }

  openModal =(index)=> ()=>{
    this.setState({
      modalDataIndex: index,
      modalVisible: true
    })
  }

  getTitle = (schema = {}, key)=>{
    const {description, title = key} = schema;
    if(description){
      return <Tooltip title={description}>
        {title}&nbsp;<Icon type="question-circle" theme="outlined" />
      </Tooltip>
    }
    return title;
  }

  handleDelete = (index) => ()=>{
    const {__context, dataPath} = this.props;
    const {deleteArrayItemByPath} = __context;
    const paths = [...dataPath]
    deleteArrayItemByPath(paths, index)
  }

  handleAdd = (index)=> ()=>{
    const {__context, dataPath} = this.props;
    const {addArrayItemByPath} = __context;
    const paths = [...dataPath]
    addArrayItemByPath(paths, index , {})
  }

  getColumns (config) {
    const {items} = config;
    const {advFields = [], properties} = items;

    const settingIcons = [{
      render: (text, record)=>{
        const index = record.key;
        return <Icon key="plus" onClick={this.handleAdd(index)} type="plus"  />
      }
    }, {
      render: (text, record)=>{
        const index = record.key;
        return <Popconfirm
          key={getName('delete')}
          title={getName('delete-array-item')}
          onConfirm={this.handleDelete(index)}
          okText="Yes"
          cancelText="No"
        >
          <Icon key="delete" type="delete"  />
        </Popconfirm>
      }
    }];
    if(Array.isArray(advFields) && advFields.length > 0){
      settingIcons.unshift({
        render: (text, record)=>{
          const index = record.key;
          return <Icon key="setting" type="setting" onClick={this.openModal(index)} />
        }
      })
    }

    const settingColumns = [{
      title: '',
      key: 'setting',
      width: 140,
      render: (text, record)=>{
        return <div className="setting-column-item">
          {settingIcons.map(item=>{
            return item.render(text, record)
          })}
        </div>
      }
    }]

    const initColumns = [{
      title: '',
      key: 'drag',
      width: 50,
      render: ()=>{
        return <div is-drag="true" className="setting-column-item-drag">
          <Icon type="drag" />
        </div>
      }
    }]
    
    return [...Object.keys (properties).reduce ((result, key) => {
      if(advFields.indexOf(key) !== -1)return result;
      let itemConfig = properties[key];
      const C = getComponent(FieldComponent, itemConfig);
      
      result.push ({
        dataIndex: key,
        title: this.getTitle(itemConfig, key),
        render: (text, record) => {
          const index = record.key;
          const {store} = this.props.__context;
          const {validateResult} = store;
          const errorMessage = getErrorMessage([...this.props.dataPath, index, key], validateResult)

          const schema = schemaHander(itemConfig, {
            record,
            formData: store.value,
          })

          const ui = (schema.ui || {});

          let el = <C 
            {...ui.options} 
            schema={schema} 
            default={itemConfig.default}
            onBlur={this.props.onBlur}  
            value={text} 
            onChange={this.handleChange (key, index)} 
          />
          
          if(ui.hide === true){
            el = null;
          }
          return this.objectKeyRender({
            type: 'array-object-item',
            el, 
            errorMessage,
            schema: itemConfig
          })
           
        },
      });
      return result;
    }, initColumns), ...settingColumns];
  }

  objectKeyRender = ({
    el, 
    errorMessage
  })=>{
    return <div>
      {el}
      {errorMessage && <div  className="error-message">{errorMessage}</div>}
    </div>;
  }

  customDragChange = (from, to)=>{
    const {__context, dataPath} = this.props;
    const {moveArrayItem} = __context;
    const paths = [...dataPath]
    moveArrayItem(paths, from, to)
  }

  components = {
    body: {
      row: (props)=>{
        return <TableRow {...props} customDragChange={this.customDragChange} />
      }
    },
  };

  openFastEdit = ()=>{
    const {value, uniqueField} = this.props;
    const fields = value.map(item=> item[uniqueField]);
    this.setState({
      fastEditModalVisible: true,
      fastFields: fields.join('\n')
    })
  }

  closeFastEdit = ()=>{
    this.setState({
      fastEditModalVisible: false
    })
  }

  handleChangeFast = (e)=>{
    this.setState({
      fastFields: e.target.value
    })
  }

  handleChangeBlurFast = ()=>{
    const {fastFields = ''} = this.state;
    if(fastFields.indexOf(',') !== -1){
      const arr = fastFields.split(',');
      this.setState({
        fastFields: arr.join('\n')
      })
    }
  }

  handleFastEditSumbit = ()=>{
    const {fastFields = ''} = this.state;
    let arr = fastFields.split('\n').filter(item=>{
      item = item || '';
      if(/^ *$/.test(item)){
        return false;
      }
      return true;
    }).map(item=>{
      item = item || '';
      return item.trim()
    })
    arr = union(arr);
    
    const {value = [], uniqueField} = this.props;
    const columns = arr.map(item=>{
      let findItem = find(value, colData => colData[uniqueField] === item)
      if(findItem){
        return findItem;
      }else{
        return {
          [uniqueField]: item
        }
      }
    })

    const {__context, dataPath} = this.props;
    const {setValueByPath} = __context;
    const paths = [...dataPath]
    setValueByPath(paths, columns)
    this.closeFastEdit()
  }

  renderFastModal(){
    const {fastFields, fastEditModalVisible} = this.state;
    return fastEditModalVisible && <Modal
      title={getName('quick-edit')}
      visible={fastEditModalVisible}
      onOk={this.handleFastEditSumbit}
      onCancel={this.closeFastEdit}
      width={500}
    >
      <div className="array-schema-form-fast-edit">
        <Input.TextArea 
          value={fastFields}
          onBlur={this.handleChangeBlurFast}
          onChange={this.handleChangeFast}
        />
      </div>
    </Modal>
  }

  render () {
    const {uniqueField, schema, value = []} = this.props;
    if(!Array.isArray(value)){
      return null;
    }
    const columns = this.getColumns (schema);
    return (
      <div  className="array-field-form">
        {this.renderModal(schema)}
        {this.renderFastModal()}
        <div className="header">
          <div className="title">{schema.title || ''}</div>
          {uniqueField && <div className="fast-edit">
            <Button onClick={this.openFastEdit}>{getName('quick-edit')}</Button>
          </div>}
          <div className="add-button">
            <Button onClick={this.handleAdd()} type="primary">{getName('add')}</Button>
          </div>
        </div>
        <Table
          {...this.props}
          onChange={()=>{}}
          className="array-field-form-table"
          pagination={{
            defaultPageSize: 20,
            showSizeChanger:true
          }}
          // pagination={false}
          bordered={true}
          columns={columns}
          dataSource={value.map((item, index)=>{
            return {
              key: index,
              ...item,
            }
          })}
          components={this.components}
        />
      </div>
    );
  }
}
