import React from 'react'
import ReactDom from 'react-dom'
import 'antd/dist/antd.css'
import JSF from '../src'
import simple from './simple-case'
import {Select} from 'antd'
import AceEditor from '../src/widgets/ace-editor'
import './index.scss'

const schema = {
  simple
}



export default class App extends React.PureComponent {
  state = {
    data: {},
    selectValue: 'simple',
    jsonSchema: JSON.stringify(schema.simple,null,2)
  };

  onChange =(value)=>{
    this.setState({
      data: value
    })
  }

  render(){
    return <div className="container">
      <div className="header-box">
        {<Select value={this.state.selectValue} onChange={e=>{
          this.setState({
            selectValue: e.target.value,
            jsonSchema: schema[e.target.value]
          })
        }}>
          {Object.keys(schema).map(key=>{
            return <Select.Option key={key} value={key}>
              {key}
            </Select.Option>
          })}
        </Select>}
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
        <div key={this.state.jsonSchema} className="body-right">
          <h3>FORM</h3>
          {this.renderSchema(JSON.parse(this.state.jsonSchema))}
        </div>
      </div>
    </div>
  }

  renderSchema (data) {
    return (
      <JSF onChange={this.onChange} value={this.state.data} schema={data} />
    );
  }
}


ReactDom.render(<App />, document.getElementById('root'))