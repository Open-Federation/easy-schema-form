import {Select as AntdSelect, Switch as AntdSwitch, InputNumber, DatePicker as AntdDatePicker} from 'antd'
import handleDefault from './handleDefault'
import React from 'react'
import CodeEditor from './code-editor'
import PropTypes from 'prop-types'
import Input from './input'
import moment from 'moment'


const defaultDateProps = {
  format: 'YYYYMMDD',
}

const DatePicker = (props)=>{
  const newProps = {
    ...defaultDateProps,
    ...props
  }
  const {format} = newProps;
  const fn = (momentObj)=>{
    props.onChange(momentObj ? momentObj.format(format) : null)
  }
  const value = props.value ? moment(props.value, format) : undefined;
  return <AntdDatePicker {...newProps} format={format} value={value} onChange={fn}/>
}

DatePicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func
}

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
  const {changeParentData, ...extraProps} = props; //eslint-disable-line
  return <AntdSwitch  {...extraProps} checked={props.value} />
}

const maps = {
  Input,
  InputNumber,
  Select,
  Switch,
  TextArea: Input.TextArea,
  CodeEditor,
  DatePicker
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