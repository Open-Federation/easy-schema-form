import test from 'ava'
import produce from 'immer';
import {moveArrayItemAction, 
  setValueByPathAction, 
  addArrayItemByPathAction,
  deleteArrayItemByPathAction
} from '../model'

test('根节点移动', t=>{
  const store = {
    value: [{a:1}, {a:2}]
  }
  const data = produce(store, draftStore=>{
    moveArrayItemAction(
      draftStore,
      {
        paths: [],
        from: 0,
        to: 1
      },
      store
    )
  })
  t.deepEqual(data, {
    value: [{a:2}, {a:1}]
  })
})

test('深层节点移动', t=>{
  const store = {
    value: {
      t: [{a:1}, {a:2}]
    }
  }
  const data = produce(store, draftStore=>{
    moveArrayItemAction(
      draftStore,
      {
        paths: ['t'],
        from: 0,
        to: 1
      },
      store
    )
  })
  t.deepEqual(data, {
    value: {
      t: [{a:2}, {a:1}]
    }
  })
})

test('setValueByPathAction', t=>{
  const store = {
    value: {
      x: 1
    }
  }
  const data = produce(store, draftStore=>{
    setValueByPathAction(draftStore, {
      paths: ['x'], 
      value: 2
    })
  })
  t.is(data.value.x, 2)
})

test('index is undefined, addArrayItemByPathAction ', t=>{
  const store = {
    value: {
      arr: []
    }
  }
  const data = produce(store, draftStore=>{
    addArrayItemByPathAction(draftStore, {
      paths: ['arr'], 
      index: undefined, 
      value: {x:1}
    })
  })
  t.is(data.value.arr[0].x, 1)
})

test('index is 1, addArrayItemByPathAction ', t=>{
  const store3 = {
    value: {
      arr: [{
        t:1
      }, {
        t: 2
      }, {
        t: 3
      }]
    }
  }
  const data = produce(store3, draftStore=>{
    addArrayItemByPathAction(draftStore, {
      paths: ['arr'], 
      index: 1, 
      value: {t: 100}
    })
  })
  t.is(data.value.arr[2].t, 100)
})

test('deleteArrayItemByPathAction ', t=>{
  const store3 = {
    value: {
      arr: [{
        t:1
      }, {
        t: 2
      }, {
        t: 3
      }]
    }
  }
  const data = produce(store3, draftStore=>{
    deleteArrayItemByPathAction(draftStore, {
      paths: ['arr'], 
      index: 1
    })
  })
  t.is(data.value.arr[1].t, 3)
})