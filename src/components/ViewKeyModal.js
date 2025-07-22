'use client'

import { useState, useEffect } from 'react'
import Button from './ui/Button'

export default function ViewKeyModal({ isOpen, onClose, keyId, onDelete, onEdit }) {
  const [keyData, setKeyData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showValue, setShowValue] = useState(false)
  const [copied, setCopied] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (isOpen && keyId) {
      fetchKeyData()
    }
  }, [isOpen, keyId])

  const fetchKeyData = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/keys/${keyId}?includeValue=true`, {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to fetch key data')
      }

      const data = await response.json()
      setKeyData(data.key)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleClose = () => {
    setKeyData(null)
    setError(null)
    setShowValue(false)
    setCopied(false)
    setConfirmDelete(false)
    onClose()
  }

  const handleDelete = async () => {
    if (!keyData) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true)

    try {
      const response = await fetch(`/api/keys/${keyData.id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to delete key')
      }

      // Notify parent component about deletion
      if (onDelete) {
        onDelete(keyData.id)
      }

      // Close modal
      handleClose()

    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'PASSWORD': return 'bg-green-100 text-green-800'
      case 'API_KEY': return 'bg-blue-100 text-blue-800'
      case 'SSH_KEY': return 'bg-purple-100 text-purple-800'
      case 'CERTIFICATE': return 'bg-orange-100 text-orange-800'
      case 'SECRET': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Key Details</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <div className="text-red-600 mb-4">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-sm">{error}</p>
              </div>
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
            </div>
          )}

          {keyData && !loading && (
            <div className="space-y-6">
              {/* Key Name and Type */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{keyData.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(keyData.type)}`}>
                      {keyData.type.replace('_', ' ')}
                    </span>
                    {keyData.isFavorite && (
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(keyData.name, 'name')}
                >
                  {copied === 'name' ? 'Copied!' : 'Copy Name'}
                </Button>
              </div>

              {/* Description */}
              {keyData.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-md">{keyData.description}</p>
                </div>
              )}

              {/* Key Value */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Key Value</label>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowValue(!showValue)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {showValue ? 'Hide' : 'Show'}
                    </button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(keyData.value, 'value')}
                    >
                      {copied === 'value' ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <textarea
                    readOnly
                    value={showValue ? keyData.value : '••••••••••••••••••••••••••••••••'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm text-gray-900"
                    rows={4}
                  />
                  {!showValue && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-md">
                      <span className="text-gray-400 text-sm">Click &quot;Show&quot; to reveal the value</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              {keyData.tags && keyData.tags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {keyData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-900 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Created:</span>
                    <p>{new Date(keyData.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="font-medium">Last Updated:</span>
                    <p>{new Date(keyData.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col space-y-3 pt-4 border-t">
                {confirmDelete && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-3 mb-2 text-center">
                    <strong>Warning:</strong> This action cannot be undone. Click delete again to confirm.
                  </div>
                )}
                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={deleting}
                    className="flex-1"
                  >
                    Close
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => {
                      if (onEdit) {
                        onEdit(keyData.id)
                      }
                    }}
                    disabled={deleting}
                    className="flex-1"
                  >
                    Edit Key
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1"
                  >
                    {deleting ? 'Deleting...' : confirmDelete ? 'Confirm Delete' : 'Delete Key'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 