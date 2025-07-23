'use client'

import { useState, useEffect } from 'react'
import Button from './ui/Button'
import Input from './ui/Input'

export default function AddKeyModal({ isOpen, onClose, onSuccess, folderId }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    value: '',
    type: 'PASSWORD',
    tags: '',
    isFavorite: false
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [userPlan, setUserPlan] = useState('FREE');
  const [secretCount, setSecretCount] = useState(0);
  const [countLoading, setCountLoading] = useState(false);

  const keyTypes = [
    { value: 'PASSWORD', label: 'Password' },
    { value: 'API_KEY', label: 'API Key' },
    { value: 'SSH_KEY', label: 'SSH Key' },
    { value: 'CERTIFICATE', label: 'Certificate' },
    { value: 'SECRET', label: 'Secret' },
    { value: 'OTHER', label: 'Other' }
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

      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          folderId,
          name: formData.name.trim(),
          description: formData.description.trim(),
          value: formData.value,
          type: formData.type,
          tags: tagsArray,
          isFavorite: formData.isFavorite
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create key')
      }

      // Reset form
      setFormData({
        name: '',
        description: '',
        value: '',
        type: 'PASSWORD',
        tags: '',
        isFavorite: false
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
        tags: '',
        isFavorite: false
      })
      setErrors({})
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-gray-700 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
                          <h2 className="text-xl font-semibold text-white">Add New Key</h2>
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
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
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
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter description (optional)"
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-800 placeholder-gray-400"
                rows="3"
              />
            </div>

            <div>
              <label htmlFor="value" className="block text-sm font-medium text-gray-300 mb-1">
                Key Value *
              </label>
              <textarea
                id="value"
                name="value"
                value={formData.value}
                onChange={handleInputChange}
                placeholder="Enter key value"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-800 placeholder-gray-400 ${
                  errors.value ? 'border-red-500' : 'border-gray-600'
                }`}
                rows="4"
                required
              />
              {errors.value && (
                <p className="mt-1 text-sm text-red-400">{errors.value}</p>
              )}
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1">
                Key Type *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-800 ${
                  errors.type ? 'border-red-500' : 'border-gray-600'
                }`}
                required
              >
                {keyTypes.map(type => (
                  <option key={type.value} value={type.value} className="bg-gray-800 text-white">
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-400">{errors.type}</p>
              )}
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">
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
              <p className="mt-1 text-xs text-gray-400">
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
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-800"
              />
              <label htmlFor="isFavorite" className="ml-2 block text-sm text-gray-300">
                Mark as favorite
              </label>
            </div>

            {errors.submit && (
              <div className="text-sm text-red-400 bg-red-900/20 p-3 rounded-md border border-red-500/20">
                {errors.submit}
              </div>
            )}
            {userPlan === 'FREE' && secretCount >= 5 && (
              <div className="text-sm text-red-400 bg-red-900/20 p-3 rounded-md mb-2 border border-red-500/20">
                Free plan users can only create up to 5 secrets. <a href="/pricing" className="text-blue-400 underline">Upgrade to add more.</a>
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