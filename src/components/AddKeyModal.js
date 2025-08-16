'use client'

import { useState, useEffect } from 'react'
import Button from './ui/Button'
import Input from './ui/Input'

export default function AddKeyModal({ isOpen, onClose, onSuccess, folderId, preSelectedEnvironment = 'DEVELOPMENT' }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    value: '',
    type: 'PASSWORD',
    environment: 'DEVELOPMENT',
    tags: '',
    isFavorite: false
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [userPlan, setUserPlan] = useState('FREE');
  const [secretCount, setSecretCount] = useState(0);
  const [countLoading, setCountLoading] = useState(false);

  // Update environment when preSelectedEnvironment changes
  useEffect(() => {
    if (preSelectedEnvironment && isOpen) {
      setFormData(prev => ({
        ...prev,
        environment: preSelectedEnvironment
      }))
    }
  }, [preSelectedEnvironment, isOpen])

  const keyTypes = [
    { value: 'PASSWORD', label: 'Password' },
    { value: 'API_KEY', label: 'API Key' },
    { value: 'SSH_KEY', label: 'SSH Key' },
    { value: 'CERTIFICATE', label: 'Certificate' },
    { value: 'SECRET', label: 'Secret' },
    { value: 'OTHER', label: 'Other' }
  ]

  const environments = [
    { value: 'DEVELOPMENT', label: 'Development', color: 'bg-blue-100 text-blue-800' },
    { value: 'STAGING', label: 'Staging', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'TESTING', label: 'Testing', color: 'bg-purple-100 text-purple-800' },
    { value: 'PRODUCTION', label: 'Production', color: 'bg-red-100 text-red-800' },
    { value: 'LOCAL', label: 'Local', color: 'bg-green-100 text-green-800' },
    { value: 'OTHER', label: 'Other', color: 'bg-gray-100 text-gray-800' }
  ]

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Key name is required'
    }

    if (!formData.value.trim()) {
      newErrors.value = 'Key value is required'
    }

    if (!formData.type) {
      newErrors.type = 'Key type is required'
    }

    if (!formData.environment) {
      newErrors.environment = 'Environment is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Fetch user plan and secret count
  const fetchPlanAndCount = async () => {
    setCountLoading(true);
    try {
      // Fetch user info
      const userRes = await fetch('/api/auth/me', { credentials: 'include' });
      const userData = await userRes.json();
      setUserPlan(userData.user?.plan || 'FREE');
      // Fetch total secrets for user
      const keysRes = await fetch(`/api/keys?folderId=${folderId}&limit=1000`, { credentials: 'include' });
      const keysData = await keysRes.json();
      setSecretCount(keysData.total || 0);
    } catch (err) {
      // fallback: allow
      setUserPlan('FREE');
      setSecretCount(0);
    } finally {
      setCountLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchPlanAndCount();
    }
  }, [isOpen, folderId]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Fetch current plan and count before submitting
      const userRes = await fetch('/api/auth/me', { credentials: 'include' });
      const userData = await userRes.json();
      const currentPlan = userData.user?.plan || 'FREE';
      
      const keysRes = await fetch(`/api/keys?folderId=${folderId}&limit=1000`, { credentials: 'include' });
      const keysData = await keysRes.json();
      const currentCount = keysData.total || 0;
      
      if (currentPlan === 'FREE' && currentCount >= 5) {
        setErrors({ submit: 'Free plan users can only create up to 5 secrets. Upgrade to add more.' });
        setLoading(false);
        return;
      }

      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      // Prepare key data
      const keyData = {
        folderId,
        name: formData.name.trim(),
        description: formData.description.trim(),
        value: formData.value,
        type: formData.type,
        tags: tagsArray,
        isFavorite: formData.isFavorite,
        environment: formData.environment
      }

      // Add expiration date if provided (available for all users)
      if (formData.expiresAt) {
        keyData.expiresAt = formData.expiresAt
      }

      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(keyData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create key')
      }

      // Reset form but preserve environment selection for easy consecutive key creation
      const currentEnvironment = formData.environment
      setFormData({
        name: '',
        description: '',
        value: '',
        type: 'PASSWORD',
        environment: currentEnvironment, // Keep the same environment
        tags: '',
        isFavorite: false,
        expiresAt: ''
      })
      setErrors({})

      // Close modal and notify parent
      onClose()
      onSuccess(data.key)

    } catch (error) {
      console.error('Error creating key:', error)
      setErrors({ submit: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: '',
        description: '',
        value: '',
        type: 'PASSWORD',
        environment: 'DEVELOPMENT',
        tags: '',
        isFavorite: false,
        expiresAt: ''
      })
      setErrors({})
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Add New Key</h2>
              {preSelectedEnvironment && preSelectedEnvironment !== 'DEVELOPMENT' && (
                <div className="flex items-center mt-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    environments.find(env => env.value === preSelectedEnvironment)?.color || 'bg-gray-100 text-gray-800'
                  }`}>
                    {preSelectedEnvironment === 'STAGING' ? '🚀 Staging Environment' :
                     preSelectedEnvironment === 'TESTING' ? '🧪 Testing Environment' :
                     preSelectedEnvironment === 'PRODUCTION' ? '🔴 Production Environment' :
                     preSelectedEnvironment === 'LOCAL' ? '🏠 Local Environment' :
                     '📦 Other Environment'}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Key Name *
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter key name"
                error={errors.name}
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter description (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500"
                rows="3"
              />
            </div>

            <div>
              <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
                Key Value *
              </label>
              <textarea
                id="value"
                name="value"
                value={formData.value}
                onChange={handleInputChange}
                placeholder="Enter key value"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500 ${
                  errors.value ? 'border-red-500' : 'border-gray-300'
                }`}
                rows="4"
                required
              />
              {errors.value && (
                <p className="mt-1 text-sm text-red-600">{errors.value}</p>
              )}
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Key Type *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white ${
                  errors.type ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              >
                {keyTypes.map(type => (
                  <option key={type.value} value={type.value} className="bg-white text-gray-900">
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Environment *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {environments.map(env => (
                  <button
                    key={env.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, environment: env.value }))}
                    className={`relative p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                      formData.environment === env.value
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`text-sm font-medium ${
                          formData.environment === env.value ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {env.label}
                        </div>
                        <div className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-1 ${env.color}`}>
                          {env.value === 'DEVELOPMENT' ? '🔧 Dev' :
                           env.value === 'STAGING' ? '🚀 Staging' :
                           env.value === 'TESTING' ? '🧪 Test' :
                           env.value === 'PRODUCTION' ? '🔴 Prod' :
                           env.value === 'LOCAL' ? '🏠 Local' :
                           '📦 Other'}
                        </div>
                      </div>
                      {formData.environment === env.value && (
                        <div className="text-blue-500">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              {errors.environment && (
                <p className="mt-2 text-sm text-red-600">{errors.environment}</p>
              )}
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start">
                  <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="text-xs text-blue-700">
                    <span className="font-medium">💡 Quick Tip:</span> Choose the environment where this secret will be used.
                    <span className="block mt-1">🔴 Production keys are critical - handle with extra care!</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Expiration Date Field - Available for all users */}
            <div>
              <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700 mb-1">
                Expiration Date
              </label>
              <input
                id="expiresAt"
                name="expiresAt"
                type="datetime-local"
                value={formData.expiresAt}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                min={new Date().toISOString().slice(0, 16)}
              />
              {errors.expiresAt && (
                <p className="mt-1 text-sm text-red-600">{errors.expiresAt}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Optional: Set when this key should expire. Leave empty for no expiration.
              </p>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <Input
                id="tags"
                name="tags"
                type="text"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="Enter tags separated by commas"
              />
              <p className="mt-1 text-xs text-gray-500">
                Separate multiple tags with commas (e.g., production, api, backend)
              </p>
            </div>

            <div className="flex items-center">
              <input
                id="isFavorite"
                name="isFavorite"
                type="checkbox"
                checked={formData.isFavorite}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded bg-white"
              />
              <label htmlFor="isFavorite" className="ml-2 block text-sm text-gray-700">
                Mark as favorite
              </label>
            </div>

            {errors.submit && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                {errors.submit}
              </div>
            )}
            {userPlan === 'FREE' && secretCount >= 5 && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md mb-2 border border-red-200">
                Free plan users can only create up to 5 secrets. <a href="/pricing" className="text-blue-600 underline">Upgrade to add more.</a>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading || (userPlan === 'FREE' && secretCount >= 5) || countLoading}
                className="flex-1"
              >
                {loading ? 'Creating...' : 'Create Key'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 