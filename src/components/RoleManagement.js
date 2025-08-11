'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Input, Modal, Badge, Alert } from './ui';

export default function RoleManagement() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [selectedRole, setSelectedRole] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: []
  });

  useEffect(() => {
    loadRoles();
    loadPermissions();
  }, []);

  const loadRoles = async () => {
    try {
      const response = await fetch('/api/roles');
      const data = await response.json();
      
      if (data.success) {
        setRoles(data.roles);
      } else {
        setError('Failed to load roles');
      }
    } catch (error) {
      setError('Error loading roles');
    } finally {
      setLoading(false);
    }
  };

  const loadPermissions = async () => {
    try {
      const response = await fetch('/api/permissions');
      const data = await response.json();
      
      if (data.success) {
        setPermissions(data.permissions);
      }
    } catch (error) {
      console.error('Error loading permissions:', error);
    }
  };

  const handleCreateRole = async () => {
    try {
      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('Role created successfully');
        setIsCreateModalOpen(false);
        resetForm();
        loadRoles();
      } else {
        setError(data.error || 'Failed to create role');
      }
    } catch (error) {
      setError('Error creating role');
    }
  };

  const handleUpdateRole = async () => {
    try {
      const response = await fetch(`/api/roles/${selectedRole.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('Role updated successfully');
        setIsEditModalOpen(false);
        setSelectedRole(null);
        resetForm();
        loadRoles();
      } else {
        setError(data.error || 'Failed to update role');
      }
    } catch (error) {
      setError('Error updating role');
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (!confirm('Are you sure you want to delete this role?')) return;

    try {
      const response = await fetch(`/api/roles/${roleId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('Role deleted successfully');
        loadRoles();
      } else {
        setError(data.error || 'Failed to delete role');
      }
    } catch (error) {
      setError('Error deleting role');
    }
  };

  const openEditModal = (role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions
    });
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      permissions: []
    });
  };

  const togglePermission = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const getPermissionCategoryColor = (category) => {
    const colors = {
      keys: 'blue',
      folders: 'green',
      team: 'purple',
      roles: 'orange',
      billing: 'red',
      settings: 'gray',
      audit: 'yellow',
      api: 'indigo'
    };
    return colors[category] || 'gray';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
          <p className="text-gray-600">Manage user roles and permissions</p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Create Role
        </Button>
      </div>

      {/* Alerts */}
      {error && (
        <Alert type="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert type="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map(role => (
          <RoleCard
            key={role.id}
            role={role}
            onEdit={() => openEditModal(role)}
            onDelete={() => handleDeleteRole(role.id)}
            permissions={permissions}
          />
        ))}
      </div>

      {/* Create Role Modal */}
      <RoleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Role"
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleCreateRole}
        permissions={permissions}
        getPermissionCategoryColor={getPermissionCategoryColor}
        togglePermission={togglePermission}
      />

      {/* Edit Role Modal */}
      <RoleModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Role"
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleUpdateRole}
        permissions={permissions}
        getPermissionCategoryColor={getPermissionCategoryColor}
        togglePermission={togglePermission}
        isEdit={true}
        selectedRole={selectedRole}
      />
    </div>
  );
}

// Role Card Component
function RoleCard({ role, onEdit, onDelete, permissions }) {
  const getPermissionCategoryColor = (category) => {
    const colors = {
      keys: 'blue',
      folders: 'green',
      team: 'purple',
      roles: 'orange',
      billing: 'red',
      settings: 'gray',
      audit: 'yellow',
      api: 'indigo'
    };
    return colors[category] || 'gray';
  };

  const getCategoryFromPermission = (permission) => {
    const categories = {
      keys: ['keys:read', 'keys:write', 'keys:delete', 'keys:rotate'],
      folders: ['folders:read', 'folders:write', 'folders:delete'],
      team: ['team:read', 'team:write', 'team:delete'],
      roles: ['roles:read', 'roles:write', 'roles:delete'],
      billing: ['billing:read', 'billing:write'],
      settings: ['settings:read', 'settings:write'],
      audit: ['audit:read', 'audit:export'],
      api: ['api:read', 'api:write', 'api:admin']
    };

    for (const [category, perms] of Object.entries(categories)) {
      if (perms.includes(permission)) return category;
    }
    return 'other';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
            <p className="text-sm text-gray-600">{role.description}</p>
          </div>
          <div className="flex space-x-2">
            {role.isSystem && (
              <Badge color="gray">System</Badge>
            )}
            <Badge color={role.isActive ? 'green' : 'red'}>
              {role.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Permissions ({role.permissions.length})
          </p>
          <div className="flex flex-wrap gap-1">
            {role.permissions.slice(0, 5).map(permission => {
              const category = getCategoryFromPermission(permission);
              const color = getPermissionCategoryColor(category);
              return (
                <Badge key={permission} color={color} size="sm">
                  {permission.split(':')[1]}
                </Badge>
              );
            })}
            {role.permissions.length > 5 && (
              <Badge color="gray" size="sm">
                +{role.permissions.length - 5} more
              </Badge>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {role.memberCount || 0} members
          </div>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onEdit}
              disabled={role.isSystem}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              color="red"
              onClick={onDelete}
              disabled={role.isSystem}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Role Modal Component
function RoleModal({ 
  isOpen, 
  onClose, 
  title, 
  formData, 
  setFormData, 
  onSubmit, 
  permissions, 
  getPermissionCategoryColor, 
  togglePermission,
  isEdit = false,
  selectedRole = null
}) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role Name
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter role name"
              disabled={isEdit && selectedRole?.isSystem}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter role description"
              disabled={isEdit && selectedRole?.isSystem}
            />
          </div>

          {/* Permissions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Permissions
            </label>
            <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
              {Object.entries(permissions).map(([category, perms]) => (
                <div key={category} className="mb-4">
                  <h4 className="text-sm font-medium text-gray-800 mb-2 capitalize">
                    {category}
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {perms.map(permission => (
                      <label key={permission.name} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(permission.name)}
                          onChange={() => togglePermission(permission.name)}
                          disabled={isEdit && selectedRole?.isSystem}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">
                          {permission.description}
                        </span>
                        <Badge 
                          color={getPermissionCategoryColor(category)} 
                          size="sm"
                        >
                          {permission.name.split(':')[1]}
                        </Badge>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={onSubmit}
            disabled={!formData.name || !formData.description}
          >
            {isEdit ? 'Update Role' : 'Create Role'}
          </Button>
        </div>
      </div>
    </Modal>
  );
} 