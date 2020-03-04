import test from 'ava';
import SchemaForm from '../index';
import React from 'react';
// import PropTypes from 'prop-types';
import ObjectSchemaForm from '../object-schema-form';
import ArraySchemaForm from '../array-schema-form';

import {mount, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure ({adapter: new Adapter ()});

test ('test object schema', t => {
  const schema = {
    type: 'object',
    properties: {
      x: {
        type: 'string',
      },
    },
  };
  const wrapper = mount (<SchemaForm schema={schema} onChange={() => {}} />);
  const findItems = wrapper.find (ObjectSchemaForm);
  t.is (findItems.length, 1);
});

test ('test array schema', t => {
  const schema = {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        x: {
          type: 'string',
        },
      },
    },
  };
  const wrapper = mount (<SchemaForm schema={schema} onChange={() => {}} />);
  const findItems = wrapper.find (ArraySchemaForm);
  t.is (findItems.length, 1);
});

test ('test object and array schema', t => {
  const schema = {
    type: 'object',
    properties: {
      x: {
        type: 'string',
      },
      arr: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            x: {
              type: 'string',
            },
          },
        },
      },
    },
  };
  const wrapper = mount (<SchemaForm schema={schema} onChange={() => {}} />);
  const findItems = wrapper.find (ArraySchemaForm);
  t.is (findItems.length, 1);

  const findItems2 = wrapper.find (ObjectSchemaForm);
  t.is (findItems2.length, 1);
});
