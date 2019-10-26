import React from 'react'
import widgets from '../widgets'

const {Switch} = widgets;

export default class NumberField extends React.PureComponent{

  static propTypes = {
  }

  render(){
    return <Switch {...this.props} />
  }
}
