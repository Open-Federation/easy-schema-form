import {Input} from 'antd';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import watchProps from '../../hoc/watchProps';

@watchProps
export default class InputBlurSearchComponent extends Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  };

  constructor (props) {
    super (props);
    this.state = {
      value: this.props.value,
    };
  }

  watch = {
    value: function (value) {
      this.setState ({
        value,
      });
    },
  };

  keypress = (e) => {
    if (e.which !== 13) return
    this.props.onChange (e.target.value)
  }

  onBlur = e => {
    this.props.onChange (e.target.value)
    this.props.onBlur()
  }

  render () {
    const {changeParentData, ...extraProps} = this.props; // eslint-disable-line
    return (
      <Input
        {...extraProps}
        value={this.state.value}
        onBlur={this.onBlur}
        onChange={e => this.setState({
          value: e.target.value
        })}
        onKeyPress={this.keypress}
      />
    );
  }
}

@watchProps
class TextArea extends Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  };

  constructor (props) {
    super (props);
    this.state = {
      value: this.props.value,
    };
  }

  watch = {
    value: function (value) {
      this.setState ({
        value,
      });
    },
  };

  keypress = (e) => {
    if (e.which !== 13) return
    this.props.onChange (e.target.value)
  }

  onBlur = e => {
    this.props.onChange (e.target.value)
    this.props.onBlur()
  }

  render () {
    return (
      <Input.TextArea
        {...this.props}
        value={this.state.value}
        onBlur={this.onBlur}
        onChange={e => this.setState({
          value: e.target.value
        })}
        onKeyPress={this.keypress}
      />
    );
  }
}

InputBlurSearchComponent.TextArea = TextArea;