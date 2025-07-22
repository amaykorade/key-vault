import React from 'react'

const Card = ({ 
  children, 
  className = '',
  padding = 'p-6',
  ...props 
}) => {
  const baseClasses = 'bg-gray-700 rounded-lg shadow-sm border border-gray-600'
  const classes = `${baseClasses} ${padding} ${className}`
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}

export default Card 