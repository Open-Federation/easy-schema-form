export default {
  type: "object",
  required: ['name'],
  properties: {
    enable: {
      title: 'Enable',
      type: "boolean",
      description: "Enable",
      default: false
    },
    email: {
      title: "Email",
      type: "string",
      enum: ["aa@qq.com", "zz@xx.com"],
      ui: {
        hander: "record.enable === true && (schema.ui.hide = false)",
        hide: true
      }
    }
    
  }
}