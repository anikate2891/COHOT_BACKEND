import React from 'react'
import '../../shared/styles/login.css'

const FormGroup = ({label , placeholder, value, onChange}) => {
  return (
    <div className='form-group'>
      <label htmlFor={label.toLowerCase()}>{label}</label>
      <input value={value}
      onChange={onChange}
      type="text" id={label.toLowerCase()} placeholder={placeholder} value={value} onChange={onChange} />
    </div>
  )
}

export default FormGroup
