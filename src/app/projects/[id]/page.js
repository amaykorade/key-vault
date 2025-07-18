'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import useAuthStore from '../../../stores/authStore'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'
import AddKeyModal from '../../../components/AddKeyModal'
import ViewKeyModal from '../../../components/ViewKeyModal'
import EditKeyModal from '../../../components/EditKeyModal'

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [project, setProject] = useState(null)
  const [keys, setKeys] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddKeyModal, setShowAddKeyModal] = useState(false)
  const [showViewKeyModal, setShowViewKeyModal] = useState(false)
  const [showEditKeyModal, setShowEditKeyModal] = useState(false)
  const [selectedKeyId, setSelectedKeyId] = useState(null)

  useEffect(() => {
    if (isAuthenticated && params.id) {
      fetchProjectDetails()
    }
  }, [isAuthenticated, params.id])

  const fetchProjectDetails = async () => {
    try {
      const response = await fetch(`/api/folders/${params.id}`, {
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error('Project not found')
      }
      
      const data = await response.json()
      setProject(data.folder)
      setKeys(data.keys || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddKeySuccess = (newKey) => {
    setKeys(prevKeys => [newKey, ...prevKeys])
  }

  const handleViewKey = (keyId) => {
    setSelectedKeyId(keyId)
    setShowViewKeyModal(true)
  }

  const handleCloseViewModal = () => {
    setShowViewKeyModal(false)
    setSelectedKeyId(null)
  }

  const handleCloseEditModal = () => {
    setShowEditKeyModal(false)
    setSelectedKeyId(null)
  }

  const handleKeyDelete = (deletedKeyId) => {
    setKeys(prevKeys => prevKeys.filter(key => key.id !== deletedKeyId))
  }

  const handleKeyEdit = (keyId) => {
    setSelectedKeyId(keyId)
    setShowEditKeyModal(true)
    setShowViewKeyModal(false) // Close view modal when opening edit modal
  }

  const handleKeyUpdate = (updatedKey) => {
    setKeys(prevKeys => prevKeys.map(key => 
      key.id === updatedKey.id ? updatedKey : key
    ))
  }

  const handleDeleteKeyFromList = async (keyId, keyName) => {
    if (!window.confirm(`Are you sure you want to delete "${keyName}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/keys/${keyId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to delete key')
      }

      // Remove from local state
      setKeys(prevKeys => prevKeys.filter(key => key.id !== keyId))

    } catch (error) {
      console.error('Error deleting key:', error)
      alert('Failed to delete key. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/dashboard">
            <Button variant="primary">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <Link href="/dashboard">
            <Button variant="primary">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <Link href="/dashboard" className="mr-4">
                <Button variant="outline" size="sm">
                  ← Back
                </Button>
              </Link>
              <div className="flex items-center">
                <div 
                  className="w-6 h-6 rounded-full mr-3"
                  style={{ backgroundColor: project.color }}
                ></div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
                  <p className="text-gray-600">{project.description || 'No description'}</p>
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button 
                variant="primary"
                onClick={() => setShowAddKeyModal(true)}
              >
                Add Key
              </Button>
            </div>
          </div>

          {/* Project Stats */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
            <Card>
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Keys
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {keys.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Active Keys
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {keys.filter(key => !key.isFavorite).length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Favorites
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {keys.filter(key => key.isFavorite).length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Keys List */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Keys</h2>
            
            {keys.length === 0 ? (
              <Card>
                <div className="text-center py-8">
                  <div className="mx-auto h-12 w-12 text-gray-400">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No keys yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by adding your first key to this project.</p>
                  <div className="mt-6">
                    <Button 
                      variant="primary"
                      onClick={() => setShowAddKeyModal(true)}
                    >
                      Add Key
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {keys.map((key) => (
                  <Card key={key.id} className="hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <h3 className="text-lg font-medium text-gray-900">{key.name}</h3>
                            {key.isFavorite && (
                              <svg className="ml-2 w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{key.description || 'No description'}</p>
                          <div className="flex items-center mt-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              key.type === 'PASSWORD' ? 'bg-green-100 text-green-800' :
                              key.type === 'API_KEY' ? 'bg-blue-100 text-blue-800' :
                              key.type === 'SSH_KEY' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {key.type.replace('_', ' ')}
                            </span>
                            {key.tags && key.tags.length > 0 && (
                              <div className="ml-2 flex space-x-1">
                                {key.tags.slice(0, 2).map((tag, index) => (
                                  <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                    {tag}
                                  </span>
                                ))}
                                {key.tags.length > 2 && (
                                  <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                    +{key.tags.length - 2}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewKey(key.id)}
                        >
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleKeyEdit(key.id)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => handleDeleteKeyFromList(key.id, key.name)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Key Modal */}
      <AddKeyModal
        isOpen={showAddKeyModal}
        onClose={() => setShowAddKeyModal(false)}
        onSuccess={handleAddKeySuccess}
        folderId={params.id}
      />

      {/* View Key Modal */}
      <ViewKeyModal
        isOpen={showViewKeyModal}
        onClose={handleCloseViewModal}
        keyId={selectedKeyId}
        onDelete={handleKeyDelete}
        onEdit={handleKeyEdit}
      />

      {/* Edit Key Modal */}
      <EditKeyModal
        isOpen={showEditKeyModal}
        onClose={handleCloseEditModal}
        keyId={selectedKeyId}
        onSuccess={handleKeyUpdate}
      />
    </div>
  )
} 