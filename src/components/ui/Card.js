import React from 'react'

const Card = ({ 
  children, 
  className = '',
  padding = 'p-6',
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-sm border border-gray-200'
  const classes = `${baseClasses} ${padding} ${className}`
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}

export default Card 