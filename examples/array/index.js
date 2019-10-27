export default {
  type: "array",
  title: "Array",
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
}