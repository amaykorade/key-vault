'use client'

import { useState, useEffect } from 'react'
import Button from './ui/Button'
import Input from './ui/Input'

export default function EditKeyModal({ isOpen, onClose, onSuccess, keyId }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    value: '',
    type: 'PASSWORD',
    tags: '',
    isFavorite: false
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [errors, setErrors] = useState({})

  const keyTypes = [
    { value: 'PASSWORD', label: 'Password' },
    { value: 'API_KEY', label: 'API Key' },
    { value: 'SSH_KEY', label: 'SSH Key' },
    { value: 'CERTIFICATE', label: 'Certificate' },
    { value: 'SECRET', label: 'Secret' },
    { value: 'OTHER', label: 'Other' }
  ]

  useEffect(() => {
    if (isOpen && keyId) {
      fetchKeyData()
    }
  }, [isOpen, keyId])

  const fetchKeyData = async () => {
    setFetching(true)
    setErrors({})

    try {
      const response = await fetch(`/api/keys/${keyId}?includeValue=true`, {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to fetch key data')
      }

      const data = await response.json()
      const key = data.key

      setFormData({
        name: key.name || '',
        description: key.description || '',
        value: key.value || '',
        type: key.type || 'PASSWORD',
        tags: key.tags ? key.tags.join(', ') : '',
        isFavorite: key.isFavorite || false
      })
    } catch (err) {
      setErrors({ fetch: err.message })
    } finally {
      setFetching(false)
    }
  }

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const response = await fetch(`/api/keys/${keyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
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
        throw new Error(data.error || 'Failed to update key')
      }

      // Close modal and notify parent
      onClose()
      onSuccess(data.key)

    } catch (error) {
      console.error('Error updating key:', error)
      setErrors({ submit: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading && !fetching) {
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
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Edit Key</h2>
            <button
              onClick={handleClose}
              disabled={loading || fetching}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {fetching && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading key data...</span>
            </div>
          )}

          {errors.fetch && (
            <div className="text-center py-8">
              <div className="text-red-600 mb-4">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-sm">{errors.fetch}</p>
              </div>
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
            </div>
          )}

          {!fetching && !errors.fetch && (
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.type ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                >
                  {keyTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                )}
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
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isFavorite" className="ml-2 block text-sm text-gray-700">
                  Mark as favorite
                </label>
              </div>

              {errors.submit && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {errors.submit}
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
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Updating...' : 'Update Key'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
} 