'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import useAuthStore from '../../../stores/authStore'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'
import AddKeyModal from '../../../components/AddKeyModal'
import ViewKeyModal from '../../../components/ViewKeyModal'
import EditKeyModal from '../../../components/EditKeyModal'
import AddFolderModal from '../../../components/AddFolderModal'
import EditFolderModal from '../../../components/EditFolderModal'

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [project, setProject] = useState(null)
  const [currentFolder, setCurrentFolder] = useState(null)
  const [folderTree, setFolderTree] = useState([])
  const [keys, setKeys] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddKeyModal, setShowAddKeyModal] = useState(false)
  const [showAddFolderModal, setShowAddFolderModal] = useState(false)
  const [showEditFolderModal, setShowEditFolderModal] = useState(false)
  const [showViewKeyModal, setShowViewKeyModal] = useState(false)
  const [showEditKeyModal, setShowEditKeyModal] = useState(false)
  const [selectedKeyId, setSelectedKeyId] = useState(null)
  const [selectedFolder, setSelectedFolder] = useState(null)
  const [environmentFilter, setEnvironmentFilter] = useState('ALL')
  const [preSelectedEnvironment, setPreSelectedEnvironment] = useState('DEVELOPMENT')
  const [breadcrumbs, setBreadcrumbs] = useState([])
  const [showProjectActions, setShowProjectActions] = useState(false)
  const [copyMessage, setCopyMessage] = useState('')
  const [projectIdCopyMessage, setProjectIdCopyMessage] = useState('')
  const projectActionsRef = useRef(null)

  // Handle clicking outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (projectActionsRef.current && !projectActionsRef.current.contains(event.target)) {
        setShowProjectActions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
      setCurrentFolder(data.folder)
      setKeys(data.keys || [])
      
      // Set initial breadcrumb
      setBreadcrumbs([{
        id: data.folder.id,
        name: data.folder.name,
        color: data.folder.color
      }])
      
      // Fetch folder tree
      await fetchFolderTree()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchFolderTree = async () => {
    try {
      const response = await fetch(`/api/folders/tree?projectId=${params.id}`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setFolderTree(data.folders || [])
      }
    } catch (error) {
      console.error('Error fetching folder tree:', error)
    }
  }

  const fetchFolderContents = async (folderId) => {
    try {
      const response = await fetch(`/api/folders/${folderId}`, {
        credentials: 'include'
      })
      
      if (!response.ok) {
        // If folder not found, redirect to project root
        console.warn(`Folder ${folderId} not found, redirecting to project root`)
        if (project && folderId !== project.id) {
          navigateToFolder(project.id)
        }
        return
      }
      
      const data = await response.json()
      setCurrentFolder(data.folder)
      setKeys(data.keys || [])
      
      // Update breadcrumbs
      updateBreadcrumbs(folderId)
    } catch (error) {
      console.error('Error fetching folder contents:', error)
      // If there's an error, redirect to project root
      if (project && folderId !== project.id) {
        navigateToFolder(project.id)
      }
    }
  }

  const updateBreadcrumbs = (folderId) => {
    const findFolderPath = (folders, targetId, path = []) => {
      for (const folder of folders) {
        const currentPath = [...path, {
          id: folder.id,
          name: folder.name,
          color: folder.color
        }]
        
        if (folder.id === targetId) {
          return currentPath
        }
        
        if (folder.children && folder.children.length > 0) {
          const found = findFolderPath(folder.children, targetId, currentPath)
          if (found) return found
        }
      }
      return null
    }
    
    const path = findFolderPath(folderTree, folderId)
    if (path) {
      setBreadcrumbs(path)
    }
  }

  const navigateToFolder = (folderId) => {
    // Prevent infinite loops by checking if we're already on this folder
    if (currentFolder?.id === folderId) {
      return
    }
    fetchFolderContents(folderId)
  }

  useEffect(() => {
    // Fetch data immediately since middleware ensures we're authenticated
    if (params.id) {
      fetchProjectDetails()
    }
  }, [params.id])

  const handleAddKeySuccess = (newKey) => {
    setKeys(prevKeys => [newKey, ...prevKeys])
  }

  const handleAddFolderSuccess = (newFolder) => {
    // Refresh folder tree and current folder contents
    fetchFolderTree()
    if (currentFolder) {
      fetchFolderContents(currentFolder.id)
    }
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
    setKeys(prevKeys => 
      prevKeys.map(key => key.id === updatedKey.id ? updatedKey : key)
    )
    setShowEditKeyModal(false)
    setSelectedKeyId(null)
  }

  const handleFolderEdit = (folder) => {
    setSelectedFolder(folder)
    setShowEditFolderModal(true)
  }

  const handleFolderUpdate = (updatedFolder) => {
    // Update the current folder if it's the one being edited
    if (currentFolder?.id === updatedFolder.id) {
      setCurrentFolder(updatedFolder)
    }
    
    // Update the project if it's the root folder being edited
    if (project?.id === updatedFolder.id) {
      setProject(updatedFolder)
    }
    
    // Update breadcrumbs if needed
    setBreadcrumbs(prev => 
      prev.map(crumb => crumb.id === updatedFolder.id ? updatedFolder : crumb)
    )
    
    // Refresh folder tree
    fetchFolderTree()
    
    setShowEditFolderModal(false)
    setSelectedFolder(null)
  }

  const handleFolderDelete = async (folderId, folderName) => {
    if (!confirm(`Are you sure you want to delete "${folderName}"? This will also delete all subfolders and move all keys to the root level.`)) {
      return
    }

    try {
      const response = await fetch(`/api/folders/${folderId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to delete folder')
      }

      // If we deleted the project itself, redirect to dashboard
      if (project?.id === folderId) {
        router.push('/dashboard')
        return
      }

      // If we deleted the current folder, navigate to project root
      if (currentFolder?.id === folderId) {
        navigateToFolder(project.id)
      }

      // Refresh folder tree and project details
      await fetchFolderTree()
      await fetchProjectDetails()
    } catch (error) {
      console.error('Error deleting folder:', error)
      alert(`Failed to delete folder: ${error.message}`)
    }
  }

  // Filter keys by environment
  const filteredKeys = environmentFilter === 'ALL' 
    ? keys 
    : keys.filter(key => key.environment === environmentFilter)

  // Environment options for filter
  const environmentOptions = [
    { value: 'ALL', label: 'All Environments', color: 'bg-gray-100 text-gray-800' },
    { value: 'DEVELOPMENT', label: 'Development', color: 'bg-blue-100 text-blue-800' },
    { value: 'STAGING', label: 'Staging', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'TESTING', label: 'Testing', color: 'bg-purple-100 text-purple-800' },
    { value: 'PRODUCTION', label: 'Production', color: 'bg-red-100 text-red-800' },
    { value: 'LOCAL', label: 'Local', color: 'bg-green-100 text-green-800' },
    { value: 'OTHER', label: 'Other', color: 'bg-gray-100 text-gray-800' }
  ]

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

  const handleCopyFolderId = async (folderId) => {
    try {
      // Show immediate feedback
      setCopyMessage('Copying...')
      
      await navigator.clipboard.writeText(folderId)
      setCopyMessage('Folder ID copied!')
      
      // Clear the message after 3 seconds
      setTimeout(() => {
        setCopyMessage('')
      }, 3000)
    } catch (error) {
      console.error('Failed to copy folder ID:', error)
      setCopyMessage('Failed to copy')
      
      // Clear the error message after 3 seconds
      setTimeout(() => {
        setCopyMessage('')
      }, 3000)
    }
  }

  // Clear copy message when navigating to a different folder
  useEffect(() => {
    if (currentFolder) {
      setCopyMessage('')
    }
  }, [currentFolder?.id])

  const renderFolderTree = (folders, level = 0) => {
    return folders.map((folder, index) => {
      const isActive = currentFolder?.id === folder.id
      const hasChildren = folder.children && folder.children.length > 0
      
      return (
        <div key={folder.id} className="mb-1">
          <div 
            className={`group flex items-center py-2.5 px-3 rounded-lg cursor-pointer transition-all duration-200 ${
              isActive 
                ? 'bg-blue-50 border border-blue-200 text-blue-900' 
                : 'hover:bg-gray-50 border border-transparent'
            }`}
            style={{ marginLeft: `${level * 16}px` }}
            onClick={() => navigateToFolder(folder.id)}
          >
            {/* Folder Icon */}
            <div className="flex-shrink-0 mr-3">
              {level === 0 ? (
                /* Project Icon */
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isActive ? 'bg-blue-500' : 'bg-blue-100'
                }`}>
                  <svg className={`w-5 h-5 ${isActive ? 'text-white' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              ) : (
                /* Subfolder Icon */
                <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                  isActive ? 'bg-blue-500' : 'bg-gray-100'
                }`}>
                  <svg className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  </svg>
                </div>
              )}
            </div>
            
            {/* Folder Name */}
            <div className="flex-1 min-w-0">
              <h4 className={`text-sm font-medium truncate ${
                isActive ? 'text-blue-900' : 'text-gray-900'
              }`}>
                {folder.name}
              </h4>
              
              {/* Description for project level */}
              {level === 0 && folder.description && (
                <p className={`text-xs mt-0.5 truncate ${
                  isActive ? 'text-blue-700' : 'text-gray-500'
                }`}>
                  {folder.description}
                </p>
              )}
            </div>
            
            {/* Folder Actions - Only show on hover and for non-active items */}
            {!isActive && (
              <div className="flex items-center space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleFolderEdit(folder)
                  }}
                  className="p-1.5 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Edit folder"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleFolderDelete(folder.id, folder.name)
                  }}
                  className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete folder"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          
          {/* Render children */}
          {hasChildren && (
            <div className="mt-1">
              {renderFolderTree(folder.children, level + 1)}
            </div>
          )}
        </div>
      )
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            {/* Back Navigation */}
            <div className="mb-6">
              <Link href="/dashboard" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </Link>
            </div>

            {/* Project Title & Actions */}
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                {/* Project Icon */}
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: project.color }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>

                {/* Project Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-sm font-medium text-gray-900">{project.name}</h1>
                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(project.id);
                          setProjectIdCopyMessage('Project ID copied!');
                          setTimeout(() => setProjectIdCopyMessage(''), 3000);
                        } catch (err) {
                          setProjectIdCopyMessage('Failed to copy');
                          setTimeout(() => setProjectIdCopyMessage(''), 3000);
                        }
                      }}
                      className={`inline-flex items-center text-xs font-mono px-2 py-1 rounded-md transition-all duration-200 cursor-pointer ${
                        projectIdCopyMessage === 'Project ID copied!' 
                          ? 'bg-green-100 text-green-700 border border-green-200' 
                          : projectIdCopyMessage === 'Failed to copy'
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : 'text-gray-500 bg-gray-100 hover:bg-gray-200 hover:text-gray-700'
                      }`}
                      title="Click to copy project ID"
                    >
                      <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      {project.id.slice(0, 8)}...{project.id.slice(-8)}
                    </button>
                    {/* Copy Message for Project ID */}
                    {projectIdCopyMessage && (
                      <div className={`text-xs font-medium animate-pulse ${
                        projectIdCopyMessage === 'Failed to copy' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {projectIdCopyMessage}
                      </div>
                    )}
                  </div>
                  {project.description && (
                    <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                {/* Primary CTA */}
                <Button 
                  variant="primary"
                  onClick={() => setShowAddKeyModal(true)}
                  className="px-4 py-2 text-sm font-medium"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Key
                </Button>

                {/* Project Actions Dropdown */}
                <div className="relative" ref={projectActionsRef}>
                  <button
                    onClick={() => setShowProjectActions(!showProjectActions)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Project actions"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {showProjectActions && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                      {currentFolder?.id === project?.id && (
                        <button
                          onClick={() => {
                            setShowAddFolderModal(true);
                            setShowProjectActions(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Add Folder
                        </button>
                      )}
                      <button
                        onClick={() => {
                          handleFolderEdit(project);
                          setShowProjectActions(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Project
                      </button>
                      <div className="border-t border-gray-200 my-1"></div>
                      <button
                        onClick={() => {
                          handleFolderDelete(project.id, project.name);
                          setShowProjectActions(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Project
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Breadcrumbs */}
          {breadcrumbs.length > 1 && (
            <div className="mb-6">
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                  {breadcrumbs.map((crumb, index) => (
                    <li key={crumb.id} className="flex items-center">
                      {index > 0 && (
                        <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      <button
                        onClick={() => navigateToFolder(crumb.id)}
                        className={`flex items-center text-sm font-medium ${
                          index === breadcrumbs.length - 1 
                            ? 'text-gray-900 cursor-default' 
                            : 'text-gray-500 hover:text-gray-700 cursor-pointer'
                        }`}
                      >
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: crumb.color }}
                        ></div>
                        {crumb.name}
                      </button>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Folder Tree Sidebar */}
            <div className="lg:col-span-1">
              <Card className="overflow-hidden">
                {/* Sidebar Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 px-3 py-3">
                  <div className="flex items-center">
                    <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center mr-2.5">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                      </svg>
                    </div>
                    <h3 className="text-xs font-medium text-gray-900">Folders</h3>
                  </div>
                </div>

                <div className="p-4">
                  {/* Helpful tip for free users */}
                  {user?.plan === 'FREE' && folderTree.length === 1 && folderTree[0].children?.length === 0 && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="text-sm text-blue-800">
                        <div className="font-medium mb-1 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          Quick Tip
                        </div>
                        <div className="text-xs">
                          Create subfolders to organize your keys by category (Database, API Keys, etc.)
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Folder Tree */}
                  <div className="space-y-1 max-h-96 overflow-y-auto">
                    {folderTree.length > 0 ? (
                      renderFolderTree(folderTree)
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                        </svg>
                        <p className="text-sm">No folders yet</p>
                        <p className="text-xs mt-1">Create your first folder to get started</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Current Folder Stats */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h2 className="text-sm font-medium text-gray-900 mb-3">
                      {currentFolder?.id === project.id ? 'Project Overview' : `${currentFolder?.name} Overview`}
                    </h2>

                  </div>
                  <div className="flex items-center space-x-6 text-xs text-gray-500">
                    <span className="flex items-center">
                      <svg className="w-3.5 h-3.5 mr-1.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                      {keys.length} keys
                    </span>
                    <span className="flex items-center">
                      <svg className="w-3.5 h-3.5 mr-1.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      </svg>
                      {currentFolder?._count?.other_folders || 0} folders
                    </span>
                    <span className="flex items-center">
                      <svg className="w-3.5 h-3.5 mr-1.5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      {keys.filter(key => key.isFavorite).length} favorites
                    </span>
                  </div>
                </div>
              </div>

              {/* Keys List */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  {/* Title removed to avoid duplication with the Overview section above */}
                </div>

                {/* Quick Add Keys by Environment */}
                  <div className="mb-5 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[11px] font-medium text-gray-600">Quick Add Key:</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowAddKeyModal(true)}
                    >
                      Custom Key
                    </Button>
                  </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    {environmentOptions.slice(1).map((env) => ( // Skip 'ALL' option
                      <button
                        key={env.value}
                        onClick={() => {
                          setPreSelectedEnvironment(env.value)
                          setShowAddKeyModal(true)
                        }}
                        className="flex flex-col items-center p-3 rounded-lg border-2 border-transparent hover:border-gray-300 transition-all duration-200 bg-white hover:shadow-md"
                      >
                          <div className="w-7 h-7 mb-1.5 flex items-center justify-center">
                          {env.value === 'DEVELOPMENT' ? (
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          ) : env.value === 'STAGING' ? (
                              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          ) : env.value === 'TESTING' ? (
                              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          ) : env.value === 'PRODUCTION' ? (
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                          ) : env.value === 'LOCAL' ? (
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                          ) : (
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          )}
                        </div>
                        <div className="text-xs font-medium text-center text-gray-700">
                          {env.value === 'DEVELOPMENT' ? 'Development' :
                           env.value === 'STAGING' ? 'Staging' :
                           env.value === 'TESTING' ? 'Testing' :
                           env.value === 'PRODUCTION' ? 'Production' :
                           env.value === 'LOCAL' ? 'Local' :
                           'Other'}
                        </div>
                        <div className="text-xs text-blue-600 mt-1 font-medium">
                          + Add
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Environment Filter */}
                {keys.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-medium text-gray-600">Filter by environment:</span>
                      <div className="flex flex-wrap gap-2">
                        {environmentOptions.map((env) => (
                          <button
                            key={env.value}
                            onClick={() => setEnvironmentFilter(env.value)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                              environmentFilter === env.value
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
                            }`}
                          >
                            {env.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {filteredKeys.length === 0 && keys.length > 0 ? (
                  <Card>
                    <div className="text-center py-8">
                      <div className="mx-auto h-12 w-12 text-gray-400">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
                        </svg>
                      </div>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No keys in this environment</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Try selecting a different environment filter above.
                      </p>
                      <div className="mt-6">
                        <Button 
                          variant="outline"
                          onClick={() => setEnvironmentFilter('ALL')}
                        >
                          Show All Keys
                        </Button>
                      </div>
                    </div>
                  </Card>
                ) : keys.length === 0 ? (
                  <Card>
                    <div className="text-center py-8">
                      <div className="mx-auto h-12 w-12 text-gray-400">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                      </div>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No keys yet</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {currentFolder?.id === project.id 
                          ? 'Get started by adding your first key to this project.'
                          : `Get started by adding your first key to ${currentFolder?.name}.`
                        }
                      </p>
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
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    {/* Table Header */}
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div className="grid grid-cols-12 gap-2 text-[11px] font-medium text-gray-700 uppercase tracking-wide">
                        <div className="col-span-4">Key Name</div>
                        <div className="col-span-2">Type</div>
                        <div className="col-span-2">Environment</div>
                        <div className="col-span-2">Description</div>
                        <div className="col-span-2">Actions</div>
                      </div>
                    </div>
                    
                    {/* Table Body */}
                    <div className="divide-y divide-gray-200">
                      {filteredKeys.map((key) => (
                        <div key={key.id} className="px-4 py-3 hover:bg-gray-50 transition-colors duration-150">
                          <div className="grid grid-cols-12 gap-2 items-center">
                            {/* Key Name */}
                            <div className="col-span-4">
                              <div className="flex items-center">
                                <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center mr-2 flex-shrink-0">
                                  <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                  </svg>
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center">
                        <span className="text-xs font-medium text-gray-900 truncate">{key.name}</span>
                                    {key.isFavorite && (
                                      <svg className="ml-1.5 w-4 h-4 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                    )}
                                  </div>
                                  {key.tags && key.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {key.tags.slice(0, 2).map((tag, index) => (
                                        <span key={index} className="inline-flex px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                                          {tag}
                                        </span>
                                      ))}
                                      {key.tags.length > 2 && (
                                        <span className="inline-flex px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                                          +{key.tags.length - 2}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {/* Type */}
                            <div className="col-span-2">
                              <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                key.type === 'PASSWORD' ? 'bg-green-100 text-green-800' :
                                key.type === 'API_KEY' ? 'bg-blue-100 text-blue-800' :
                                key.type === 'SSH_KEY' ? 'bg-purple-100 text-purple-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {key.type.replace('_', ' ')}
                              </span>
                            </div>
                            
                            {/* Environment */}
                            <div className="col-span-2">
                              <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                key.environment === 'PRODUCTION' ? 'bg-red-100 text-red-800' :
                                key.environment === 'STAGING' ? 'bg-yellow-100 text-yellow-800' :
                                key.environment === 'TESTING' ? 'bg-purple-100 text-purple-800' :
                                key.environment === 'DEVELOPMENT' ? 'bg-blue-100 text-blue-800' :
                                key.environment === 'LOCAL' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {key.environment === 'DEVELOPMENT' ? 'Dev' :
                                 key.environment === 'STAGING' ? 'Staging' :
                                 key.environment === 'TESTING' ? 'Testing' :
                                 key.environment === 'PRODUCTION' ? 'Prod' :
                                 key.environment === 'LOCAL' ? 'Local' :
                                 'Other'}
                              </span>
                            </div>
                            
                            {/* Description */}
                            <div className="col-span-2">
                              <p className="text-sm text-gray-600 truncate" title={key.description}>
                                {key.description || 'No description'}
                              </p>
                            </div>
                            
                            {/* Actions */}
                            <div className="col-span-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewKey(key.id)}
                                className="px-3 py-1.5 text-xs"
                              >
                                View
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Key Modal */}
      <AddKeyModal
        isOpen={showAddKeyModal}
        onClose={() => setShowAddKeyModal(false)}
        onSuccess={handleAddKeySuccess}
        folderId={currentFolder?.id || params.id}
        preSelectedEnvironment={preSelectedEnvironment}
      />

      {/* Add Folder Modal */}
      <AddFolderModal
        isOpen={showAddFolderModal}
        onClose={() => setShowAddFolderModal(false)}
        onSuccess={handleAddFolderSuccess}
        parentId={project?.id || params.id}
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

      {/* Edit Folder Modal */}
      <EditFolderModal
        isOpen={showEditFolderModal}
        onClose={() => {
          setShowEditFolderModal(false)
          setSelectedFolder(null)
        }}
        folder={selectedFolder}
        onUpdate={handleFolderUpdate}
        parentFolders={folderTree.filter(f => f.id !== selectedFolder?.id)}
      />
    </div>
  )
} 