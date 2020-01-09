import React from 'react'
import PropTypes from 'prop-types'
export default ()=>(Wrap)=>{
  return class extends React.PureComponent{

    static propTypes = {
      value: PropTypes.any,
      default: PropTypes.any,
      dataPath: PropTypes.any,
      onChange: PropTypes.func.isRequired
    }

    componentDidMount(){
      const {value, onChange} = this.props;
      const defaultValue = this.props.default;
      if(defaultValue && typeof value === 'undefined'){
        onChange(defaultValue)
      }
    }

    render(){
      const {dataPath, ...extraProps} = this.props;  //eslint-disable-line
      return  <Wrap {...extraProps} />
    }
  }
}