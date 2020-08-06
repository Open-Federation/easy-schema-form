import defaultJson from './default.js'
import zhCNJson from './zh_CN.js'
window.__jsf_locale = 'default';

const maps = {
  _ : defaultJson,
  zh_CN: zhCNJson
}

export default function (name){
  let locale = window.__jsf_locale;
  if(!maps[locale]){
    locale = '_';
  }
  return maps[locale][name]
}