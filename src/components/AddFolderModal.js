'use client'

import { useState } from 'react'
import Button from './ui/Button'
import Input from './ui/Input'

export default function AddFolderModal({ isOpen, onClose, onSuccess, parentId }) {
  const [newFolder, setNewFolder] = useState({
    name: '',
    description: '',
    color: '#3B82F6'
  })
  const [creating, setCreating] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCreating(true)

    try {
      const response = await fetch('/api/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...newFolder,
          parentId: parentId
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setNewFolder({ name: '', description: '', color: '#3B82F6' })
        onSuccess(data.folder)
        onClose()
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to create folder')
      }
    } catch (error) {
      console.error('Error creating folder:', error)
      alert('Failed to create folder')
    } finally {
      setCreating(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Folder</h3>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                label="Folder Name"
                name="name"
                type="text"
                placeholder="Enter folder name"
                value={newFolder.name}
                onChange={(e) => setNewFolder({...newFolder, name: e.target.value})}
                required
              />
              
              <Input
                label="Description"
                name="description"
                type="text"
                placeholder="Enter folder description (optional)"
                value={newFolder.description}
                onChange={(e) => setNewFolder({...newFolder, description: e.target.value})}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Folder Color
                </label>
                <div className="flex space-x-2">
                  {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${
                        newFolder.color === color ? 'border-gray-900' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewFolder({...newFolder, color})}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={creating}
                disabled={creating}
              >
                Create Folder
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 