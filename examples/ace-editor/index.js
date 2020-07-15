import React from 'react';
import ace from 'brace';
import PropTypes from 'prop-types';
import './index.scss'
import 'brace/mode/json'
import 'brace/mode/javascript'

window.ace = ace;

const ModeMap = {
  js: 'ace/mode/javascript',
  json: 'ace/mode/json',
  text: 'ace/mode/text',
  xml: 'ace/mode/xml',
  html: 'ace/mode/html'
};


const defaultStyle = { width: '100%', height: '200px' }

class AceEditor extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    className: PropTypes.string,
    /**
     * 编辑模式
     */
    mode: PropTypes.oneOf(['js', 'json']),
    /**
     * 是否只读
     */
    readOnly:PropTypes.bool
  }

  static defaultProps = {
    value: '',
    mode: 'json'
  }

  componentDidMount() {
    const {
      onChange,
      value,
      mode
    } = this.props;
    

    const editor = ace.edit(this.editorElement);

    this.editor = editor;
    editor.getSession().setMode(ModeMap[mode]);
    editor.$blockScrolling = Infinity;
    editor.setValue(value)
    if(this.props.readOnly){
      editor.setReadOnly(true);
    }
    this.editor.clearSelection();
    editor.on('blur', ()=>{
      if(this.props.value !== editor.getValue()){
        onChange(editor.getValue())
      }
      
    })
  }

  componentWillReceiveProps(nextProps) {
    if (!this.editor) return;
    if(nextProps.value !== this.props.value){
      this.editor.setValue(nextProps.value);
      this.editor.clearSelection();
    }
  }

  render() {
    return (
      <div
        className={this.props.className}
        style={
          this.props.className ? undefined : defaultStyle
        }
        ref={editor => {
          this.editorElement = editor;
        }}
      />
    );
  }
}


export default AceEditor;