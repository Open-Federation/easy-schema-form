import PropTypes from 'prop-types'
import React from 'react'
import widgets from '../widgets'

const {Select} = widgets;

export default class ArrayField extends React.PureComponent{

  static propTypes = {
    schema: PropTypes.object
  }

  render(){
    const {schema, ...extraProps} = this.props;
    /**
     * mode	设置 Select 的模式为多选或标签	'multiple' | 'tags'
     */
    const {mode = 'tags'} = schema;
    let options = [];
    const enumData = schema.items.enum;
    if(Array.isArray(enumData)){
      options = enumData.map((key, index)=>{
        let name = key;
        if(Array.isArray(schema.items.enumNames)){
          name = schema.items.enumNames[index] || name;
        }
        return {
          label: name,
          value: key
        }
      })
    }
    return <Select {...extraProps} mode={mode} data={options}  />
  }
}