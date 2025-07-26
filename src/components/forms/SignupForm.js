'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Card from '../ui/Card'
import { validateEmail, validatePassword, validateConfirmPassword, validateName } from '../../utils/validation'
import useAuthStore from '../../stores/authStore'
import { PASSWORD_REGEX } from '../../utils/validation';

const SignupForm = () => {
  const router = useRouter()
  const { signup, isLoading, error, clearError } = useAuthStore()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
  });

  // Clear error when component mounts
  useEffect(() => {
    clearError()
  }, [clearError])

  useEffect(() => {
    const password = formData.password;
    setPasswordChecks({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
    });
  }, [formData.password]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
    
    // Mark field as touched
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const validateField = (field, value) => {
    switch (field) {
      case 'name':
        return validateName(value)
      case 'email':
        return validateEmail(value)
      case 'password':
        return validatePassword(value)
      case 'confirmPassword':
        return validateConfirmPassword(formData.password, value)
      default:
        return null
    }
  }

  const handleBlur = (field) => {
    const value = formData[field]
    const error = validateField(field, value)
    setErrors(prev => ({ ...prev, [field]: error }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate all fields
    const newErrors = {}
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field])
      if (error) {
        newErrors[field] = error
      }
    })
    
    setErrors(newErrors)
    setTouched({ name: true, email: true, password: true, confirmPassword: true })
    
    // If there are errors, don't submit
    if (Object.keys(newErrors).length > 0) {
      return
    }
    
    // Submit form
    const { confirmPassword, ...signupData } = formData
    const result = await signup(signupData)
    
    if (result.success) {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link 
              href="/auth/login" 
              className="font-medium text-slate-600 hover:text-slate-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <Card>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {error}
                    </h3>
                  </div>
                </div>
              </div>
            )}
            
            <Input
              label="Full Name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              error={touched.name ? errors.name : null}
              required
              autoComplete="name"
            />
            
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              error={touched.email ? errors.email : null}
              required
              autoComplete="email"
            />
            
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              error={touched.password ? errors.password : null}
              required
              autoComplete="new-password"
            />
            <div className="mt-2 mb-4">
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li className={passwordChecks.length ? 'text-green-600' : 'text-gray-600'}>
                  At least 8 characters long
                </li>
                <li className={passwordChecks.uppercase ? 'text-green-600' : 'text-gray-600'}>
                  One uppercase letter
                </li>
                <li className={passwordChecks.lowercase ? 'text-green-600' : 'text-gray-600'}>
                  One lowercase letter
                </li>
                <li className={passwordChecks.number ? 'text-green-600' : 'text-gray-600'}>
                  One number
                </li>
              </ul>
            </div>
            
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              onBlur={() => handleBlur('confirmPassword')}
              error={touched.confirmPassword ? errors.confirmPassword : null}
              required
              autoComplete="new-password"
            />
            
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <Link 
                  href="/terms" 
                  className="font-medium text-slate-600 hover:text-slate-500"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link 
                  href="/privacy" 
                  className="font-medium text-slate-600 hover:text-slate-500"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>
            
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              disabled={isLoading}
              className="w-full"
            >
              Create Account
            </Button>
          </form>
        </Card>
        <div className="flex flex-col items-center mt-4">
          <button
            type="button"
            onClick={() => {
              const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
              const redirectUri = `${window.location.origin}/auth/google/callback`;
              const scope = 'email profile';
              const responseType = 'code';
              
              const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=${responseType}`;
              
              window.location.href = googleAuthUrl;
            }}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 py-2 px-4 rounded hover:bg-gray-50 shadow-sm transition"
          >
            <svg width="20" height="20" viewBox="0 0 48 48" className="inline-block align-middle" xmlns="http://www.w3.org/2000/svg"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.91 2.7 30.28 0 24 0 14.82 0 6.73 5.8 2.69 14.09l7.98 6.19C12.13 13.41 17.57 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.59C43.98 37.13 46.1 31.3 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.28A14.5 14.5 0 019.5 24c0-1.49.25-2.93.67-4.28l-7.98-6.19A23.93 23.93 0 000 24c0 3.93.94 7.65 2.69 10.91l7.98-6.19z"/><path fill="#EA4335" d="M24 48c6.28 0 11.91-2.09 15.94-5.7l-7.19-5.59c-2.01 1.35-4.59 2.16-8.75 2.16-6.43 0-11.87-3.91-13.33-9.19l-7.98 6.19C6.73 42.2 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
            Sign up with Google
          </button>
        </div>
      </div>
    </div>
  )
}

export default SignupForm 