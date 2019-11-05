import React from 'react'
import ReactDom from 'react-dom'
import 'antd/dist/antd.css'
import JSF from '../src'
import simple from './simple-case'
import {Select} from 'antd'
import AceEditor from '../src/widgets/ace-editor'
import './index.scss'
import advInteractionExpression from './adv-interaction-expressin'

const schema = {
  simple,
  array: require('./array').default,
  tabs: require('./tabs').default,
  objectAndArray: require('./object-and-array').default,
  advInteractionExpression: advInteractionExpression,
}

const defaultName = 'simple'

export default class App extends React.PureComponent {
  state = {
    data: schema[defaultName].type === 'object' ?{} : [],
    selectValue: defaultName,
    jsonSchema: JSON.stringify(schema[defaultName],null,2)
  };

  onChange =(value)=>{
    this.setState({
      data: value
    })
  }

  render(){
    return <div className="container">
      <div className="header-box">
        <span>Select Schema: &nbsp;</span>
        {<Select style={{width: 400}} value={this.state.selectValue} onChange={v=>{
          this.setState({
            selectValue: v,
            jsonSchema: JSON.stringify(schema[v],null,2),
            data: schema[v].type === 'array' ? [] : {}
          })
        }}>
          {Object.keys(schema).map(key=>{
            return <Select.Option key={key} value={key}>
              {key}
            </Select.Option>
          })}
        </Select>}

        <a style={{marginLeft: 10, marginRight: 10}} href="https://github.com/hellosean1025/jsf">Github</a>

        <a style={{marginLeft: 10, marginRight: 10}} href="https://hellosean1025.github.io/json-schema-visual-editor/">Generate JSON-SCHEMA by Editor</a>
      </div>
      <div className="body-box">
        <div className="body-left">
          <h3>JSONSCHEMA</h3>
          <AceEditor className="json-editor" onChange={value=>{
            this.setState({
              jsonSchema: value
            })
          }} mode="json" value={this.state.jsonSchema} />
          <br />
          <h3>Form-Data</h3>
          <AceEditor readOnly={true} className="json-editor" mode="json" value={JSON.stringify(this.state.data,null,2)} />
        </div>
        <div className="body-right">
          <h3>FORM</h3>
          {this.renderSchema(JSON.parse(this.state.jsonSchema))}
        </div>
      </div>
    </div>
  }

  renderSchema (data) {
    return (
      <JSF key={this.state.jsonSchema} onChange={this.onChange} value={this.state.data} schema={data} />
    );
  }
}


ReactDom.render(<App />, document.getElementById('root'))