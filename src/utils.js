import {find} from 'lodash'
import widgets from './widgets'
import produce from 'immer';


function genJsonPath(dataPath = []){
  let str = '';
  dataPath.forEach(key=>{
    if(!isNaN(key)){
      str += `[${key}]`
    }else {
      str += `.${key}`
    }
  })
  return str;
}

export function getErrorMessage(dataPath = [], validateResult = []){
  let errorMessage = ''
  const currentDataPath = genJsonPath(dataPath);
  let findItem = find(validateResult, item=> item.dataPath === currentDataPath);
  if(findItem){
    errorMessage = findItem.message;
  }
  return errorMessage;
}

export function schemaHander(schema = {}, data = {}){
  const defaultHander = ()=>{}
  const {record, formData} = data;
  let hander = (schema.ui || {}).hander || defaultHander;
  if(typeof hander === 'string'){
    let fn = new Function( 'schema' ,'record',  'formData', 'realSchema', hander)
    hander = fn;
  }

  return produce (schema, draftState => {
    hander (draftState,record,  formData, schema);
  })
}

export function getComponent(FieldComponent, schema = {}){
  const customConfig = schema['ui'] || {}
  const {type} = customConfig;
  if(type){
    if(typeof type === 'function'){
      FieldComponent = type;
    }else if(typeof type === 'string'){
      FieldComponent = widgets[type];
      if(!FieldComponent){
        throw new Error(`Widget "${type}" not found.`)
      }
    }
  }
  return FieldComponent
}