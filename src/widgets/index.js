import {Select as AntdSelect, Switch as AntdSwitch, InputNumber} from 'antd'
import handleDefault from './handleDefault'
import React from 'react'
import CodeEditor from './code-editor'
import PropTypes from 'prop-types'
import Input from './input'

const Select = (props)=>{
  const {data = []} = props;
  return <AntdSelect {...props} dropdownMatchSelectWidth={false} >
    {data.map(item=>{
      return <AntdSelect.Option key={item.value} value={item.value} >
        {item.label}
      </AntdSelect.Option>
    })}
  </AntdSelect>
}

const Switch= (props)=>{
  return <AntdSwitch  {...props} checked={props.value} />
}

const maps = {
  Input,
  InputNumber,
  Select,
  Switch,
  TextArea: Input.TextArea,
  CodeEditor,
}

Switch.propTypes = {
  value: PropTypes.bool
}

Select.propTypes =  {
  data: PropTypes.array
}

const result = Object.keys(maps).reduce((result, key)=>{
  result[key] = handleDefault()(maps[key])
  return result
}, {})

export default result;