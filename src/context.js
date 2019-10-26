import React from 'react'

export const GlobalStoreContext = React.createContext({
  store: {},
  changeStore: ()=>{},
  setValueByPath: ()=>{},
  addArrayItemByPath: ()=>{},
  deleteArrayItemByPath: ()=>{},
  moveArrayItem: ()=>{}
});