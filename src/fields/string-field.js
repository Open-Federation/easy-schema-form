import PropTypes from 'prop-types'
import React from 'react'
import widgets from '../widgets'

const {Select, Input} = widgets;

export default class StringField extends React.PureComponent{

  static propTypes = {
    schema: PropTypes.object
  }

  render(){
    const {schema, ...extraProps} = this.props;
    if(Array.isArray(schema.enum)){
      const options = schema.enum.map((key, index)=>{
        let name = key;
        if(Array.isArray(schema.enumNames)){
          name = schema.enumNames[index] || name;
        }
        return {
          label: name,
          value: key
        }
      })
      return <Select {...extraProps} data={options}  />
    }else{
      return <Input {...extraProps} />
    }
  }
}