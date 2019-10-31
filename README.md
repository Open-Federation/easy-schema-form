# JSF(json-schema-form)
一个基于 jsonschema 生成form 表单的 react 组件

[Live PlayGround](https://hellosean1025.github.io/jsf/)

# 快速开始

## Install
```bash
npm i jsf.js
```

## Usage
```js
import JSONSchemaForm from 'jsf.js'
import 'jsf.js/dist/main.css'


const schema = {
  type: "object",
  required: ['name'],
  properties: {
    name: {
      title: '用户名',
      type: "string",
      description: "zzzzzz",
      pattern: "[0-9]+"
    },
  }
}

export default class App extends React.PureComponent {
  static propTypes = {
    curTab: Proptypes.string.isRequired,
    match: Proptypes.object,
  };
  state = {
    data: {}
  };

  onChange =(value)=>{
    this.setState({
      data: value
    })
  }

  render () {
    return (
      <JSONSchemaForm onChange={this.onChange} value={this.state.data} schema={schema} />
    );
  }
}

```

### License
Apache 2
