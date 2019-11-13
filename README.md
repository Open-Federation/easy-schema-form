# JSF(json-schema-form)
一个基于 jsonschema 生成form 表单的 react 组件

## 背景
react-json-schema-form 交互太难用，不得不重新造一个。。。

## 目标
1. 采用标准化交互，满足各类需求
   * 为了实现这个目的，我们对 object 类型统一为左右两栏布局;
   * 对 object Array 类型，采用了表格式布局，可以设置不常用编辑项或一些比较占用空间的编辑项通过弹层的方式打开编辑；

2. 使用了 ajv 验证库
3. 支持通过 js 表达式自定义部分交互（比如隐藏、禁用等）
4. 支持自定义组件

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
