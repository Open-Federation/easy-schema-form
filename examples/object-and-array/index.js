export default {
  type: "object",
  required: ['name'],
  properties: {
    name: {
      title: 'User',
      type: "string",
      description: "zzzzzz",
      pattern: "[0-9]+"
    },
    email: {
      title: "Email",
      type: "string",
      enum: ["aa@qq.com", "zz@xx.com"]
    },
    script: {
      type: "string",
      title: "JsScript",
      ui: {
        type: 'CodeEditor'
      }
    },
    number: {
      title: 'Number',
      type: 'number',
      default: 10
    },
    testObject: {
      title: 'testObject',
      type: 'object',
      properties: {
        name: {
          title: 'xxxx',
          type: "string",
          description: "xxxxxxx"
        },
        email: {
          title: "yyyy",
          type: "string"
        },
      }
    },
    xx: {
      type: "array",
      title: "TableConifg",
      items: {
        type: "object",
        advFields: ['code'],
        properties: {
          dataIndex: {
            type: "string",
            title: 'Field',
            pattern: "[0-9]+"
          },
          title: {
            type: "string",
            title: 'Title'
          },
          enable: {
            type: "boolean",
            title: 'Enable'
          },
          code: {
            type: "string",
            title: "Script",
            ui: {
              type: 'CodeEditor'
            }
          }
        }
      }
    },
    
  }
}