import test from 'ava'
import watchProps from '../hoc/watchProps'
import React from 'react'
import PropTypes from 'prop-types'

import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

test('if setting deep false, will shallow equal change', t=>{
  let num = 0;
  class Test1 extends React.Component{
    static propTypes = {
      params: PropTypes.object
    }
    watch = {
      "params": {
        deep: false,
        hander: function(){
          num++;
        }
      }
    }
    render(){
      return ''
    }
  }
  let C = watchProps(Test1);
  let wrapper = mount(<C params={{x: {z:1}}} />);
  t.is(num, 0)
  wrapper.setProps({
    params: {
      x: {
        z: 1
      }
    }
  })
  t.is(num, 1)
})

test('if setting deep empty, will shallow equal not', t=>{
  let num = 0;
  class Test1 extends React.Component{
    static propTypes = {
      params: PropTypes.object
    }
    watch = {
      "params": {
        hander: function(){
          num++;
        }
      }
    }
    render(){
      return ''
    }
  }
  let C = watchProps(Test1);
  let wrapper = mount(<C params={{x: {z:1}}} />);
  t.is(num, 0)
  wrapper.setProps({
    params: {
      x: {
        z: 1
      }
    }
  })
  t.is(num, 0)
})

test('test params.a, only check a change', t=>{
  let num = 0;
  let newValue;
  let oldValue;
  class Test1 extends React.Component{
    static propTypes = {
      params: PropTypes.object
    }
    watch = {
      "params.x": function(val, old){
        newValue = val;
        oldValue = old;
        num++;
      }
    }
    render(){
      return ''
    }
  }
  let C = watchProps(Test1);
  let wrapper = mount(<C params={{x: 0}} />);
  t.is(num, 0)
  wrapper.setProps({
    params: {
      x:1
    }
  })
  t.is(num, 1)
  t.is(newValue, 1)
  t.is(oldValue, 0)
})

test('if watch undefined, not throw error', t=>{
  class Deep extends React.Component{
    static propTypes = {
      params: PropTypes.object
    }
    render(){
      return ''
    }
  }
  let C = watchProps(Deep);
  let wrapper = mount(<C params={{x: 0}} />);
  wrapper.setProps({
    params: {
      x:1
    }
  })
  wrapper.text()
  t.is(wrapper.text(), '')
})


test('watchProps_deepProps', t=>{
  let num = 0;
  let newValue;
  let oldValue;
  class Deep extends React.Component{
    static propTypes = {
      params: PropTypes.object
    }
    watch = {
      params: function(val, old){
        newValue = val;
        oldValue = old;
        num++;
      }
    }
    render(){
      return ''
    }
  }
  let C = watchProps(Deep);
  let wrapper = mount(<C params={{x: 0}} />);
  t.is(num, 0)
  wrapper.setProps({
    params: {
      x:1
    }
  })
  t.is(num, 1)
  t.is(newValue.x, 1)
  t.is(oldValue.x, 0)
})


test.cb('watchProps_base',  t=>{
  /*eslint no-unused-vars: "off"*/
  let num = 0;
  class App extends React.Component{
    static propTypes = {
      x: PropTypes.string
    }
    state={
      a: this.props.x
    }

    watch ={
      x: function(val, old){
        num++;
        this.setState({
          a: val,
          old
        })
      }
    }

    render(){
      return this.state.a;
    }
  }

  let C = watchProps(App);
  let wrapper = mount(<C x={'a'} />);
  t.is(wrapper.text(), 'a');
  setTimeout(()=>{
    wrapper.setProps({
      x: 'b'
    })
  },50)
  setTimeout(()=>{
    let state = wrapper.state();
    t.is(state.old, 'a')
    t.is(state.a, 'b')
    t.end()
  },100)
})
