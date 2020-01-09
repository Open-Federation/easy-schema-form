require('babel-register')
require('core-js/es6/map')
require('core-js/es6/set')
require('raf/polyfill')
require('babel-polyfill');
const alias = require('./alias')
const path = require('path');

const root= path.resolve(__dirname, '../../../');

global.document = require('jsdom').jsdom('<body></body>')
global.window = document.defaultView
global.navigator = window.navigator

alias({
  utils: path.resolve(root, 'packages/utils/src'),
  "pc-components": path.resolve(root ,'packages/pc-components/components'),
  'common-components': path.resolve(root, 'packages/common-components/components'),
  'mobile-components': path.resolve(root, 'packages/mobile-components/components'),
})
