import AceEditor from './ace-editor'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

export default class CodeEditor extends PureComponent {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    mode: PropTypes.oneOf(['json', 'js'])
  }

  render() {
    const {value, onChange, mode = 'js'} = this.props;
    return <AceEditor mode={mode} value={value || ''} onChange={onChange} />
  }
}

