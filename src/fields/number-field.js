import PropTypes from 'prop-types'
import React from 'react'
import widgets from '../widgets'

const {InputNumber} = widgets;

export default class NumberField extends React.PureComponent{

  static propTypes = {
    schema: PropTypes.object
  }

  render(){
    return <InputNumber {...this.props} />
  }
}