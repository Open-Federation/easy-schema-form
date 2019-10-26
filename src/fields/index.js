import React from 'react'
import StringField from './string-field'
import NumberField from './number-field'
import BooleanField from './boolean-field'
import ArrayField from './array-field'
import PropTypes from 'prop-types'

const Entry =  (props)=>{
  const {schema = {}} = props;
  const maps = {
    string: StringField,
    number: NumberField,
    integer: NumberField,
    array: ArrayField,
    boolean: BooleanField
  }
  let C = maps[schema.type];
  if(!C)C = maps.string;
  return <C {...props} />
}

Entry.propTypes = {
  schema: PropTypes.object
}

export default Entry;

