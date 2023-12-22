import React from 'react'

const Img = ({className,src,alt,imgClassName}) => {
  return (
    <div className={className}>
        <img src={src} alt={alt} className={imgClassName}/>
    </div>
  )
}

export default Img