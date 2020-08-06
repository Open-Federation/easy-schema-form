module.exports = {
  "presets": [
    "@babel/react"
  ],
  "plugins": [
    ['@babel/plugin-proposal-decorators', {legacy: true}],
    ['@babel/plugin-proposal-class-properties', {loose: true}],
    ['@babel/proposal-object-rest-spread', {legacy: true}]
  ]
}
