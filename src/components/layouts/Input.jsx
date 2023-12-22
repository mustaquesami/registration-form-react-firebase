import React from 'react'

const Input = ({type,name,value,placeholder,onChange}) => {
  return (
        <input type={type} name={name} value={value} placeholder={placeholder} onChange={onChange} className='mt-2 w-full h-[50px] border border-spacing-2 rounded'/>
  )
}

export default Input