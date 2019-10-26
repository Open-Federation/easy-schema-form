import defaultJson from './default.json'
import zhCNJson from './zh_CN.json'
window.__jsf_locale = 'default';

const maps = {
  default : defaultJson,
  zh_CN: zhCNJson
}

export default function (name){
  let locale = window.__jsf_locale;
  if(!maps[locale]){
    locale = 'default';
  }
  return maps[locale][name]
}