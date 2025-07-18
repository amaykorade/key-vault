// Email validation regex
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Password validation - at least 8 characters, 1 uppercase, 1 lowercase, 1 number
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/

// Validation functions
export const validateEmail = (email) => {
  if (!email) return 'Email is required'
  if (!EMAIL_REGEX.test(email)) return 'Please enter a valid email address'
  return null
}

export const validatePassword = (password) => {
  if (!password) return 'Password is required'
  if (password.length < 8) return 'Password must be at least 8 characters long'
  if (!PASSWORD_REGEX.test(password)) {
    return 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  }
  return null
}

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your password'
  if (password !== confirmPassword) return 'Passwords do not match'
  return null
}

export const validateName = (name) => {
  if (!name) return 'Name is required'
  if (name.length < 2) return 'Name must be at least 2 characters long'
  if (name.length > 50) return 'Name must be less than 50 characters'
  return null
}

export const validateRequired = (value, fieldName) => {
  if (!value || value.trim() === '') return `${fieldName} is required`
  return null
}

// Form validation helper
export const validateForm = (values, validators) => {
  const errors = {}
  
  Object.keys(validators).forEach(field => {
    const validator = validators[field]
    const value = values[field]
    const error = validator(value, values)
    
    if (error) {
      errors[field] = error
    }
  })
  
  return errors
}

// Real-time validation helper
export const validateField = (value, validator, formValues = {}) => {
  return validator(value, formValues)
} 