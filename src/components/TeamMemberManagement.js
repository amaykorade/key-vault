'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Input, Modal, Badge, Alert, Select } from './ui';

export default function TeamMemberManagement({ teamId }) {
  const [members, setMembers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form states
  const [inviteForm, setInviteForm] = useState({
    email: '',
    roleId: '',
    permissions: []
  });

  useEffect(() => {
    if (teamId) {
      loadTeamMembers();
      loadRoles();
    }
  }, [teamId]);

  const loadTeamMembers = async () => {
    try {
      const response = await fetch(`/api/teams/${teamId}/members`);
      const data = await response.json();
      
      if (data.success) {
        setMembers(data.members);
      } else {
        setError('Failed to load team members');
      }
    } catch (error) {
      setError('Error loading team members');
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const response = await fetch('/api/roles');
      const data = await response.json();
      
      if (data.success) {
        setRoles(data.roles);
      }
    } catch (error) {
      console.error('Error loading roles:', error);
    }
  };

  const handleInviteMember = async () => {
    try {
      const response = await fetch(`/api/teams/${teamId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inviteForm)
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('Member invited successfully');
        setIsInviteModalOpen(false);
        resetInviteForm();
        loadTeamMembers();
      } else {
        setError(data.error || 'Failed to invite member');
      }
    } catch (error) {
      setError('Error inviting member');
    }
  };

  const handleUpdateMemberRole = async (memberId, roleId) => {
    try {
      const response = await fetch(`/api/teams/${teamId}/members/${memberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId })
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('Member role updated successfully');
        loadTeamMembers();
      } else {
        setError(data.error || 'Failed to update member role');
      }
    } catch (error) {
      setError('Error updating member role');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!confirm('Are you sure you want to remove this member?')) return;

    try {
      const response = await fetch(`/api/teams/${teamId}/members/${memberId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('Member removed successfully');
        loadTeamMembers();
      } else {
        setError(data.error || 'Failed to remove member');
      }
    } catch (error) {
      setError('Error removing member');
    }
  };

  const resetInviteForm = () => {
    setInviteForm({
      email: '',
      roleId: '',
      permissions: []
    });
  };

  const getRoleById = (roleId) => {
    return roles.find(role => role.id === roleId);
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
          <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
          <p className="text-gray-600">Manage team member roles and permissions</p>
        </div>
        <Button 
          onClick={() => setIsInviteModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Invite Member
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

      {/* Members List */}
      <div className="space-y-4">
        {members.map(member => (
          <MemberRow
            key={member.id}
            member={member}
            roles={roles}
            onUpdateRole={handleUpdateMemberRole}
            onRemove={handleRemoveMember}
            getRoleById={getRoleById}
            getPermissionCategoryColor={getPermissionCategoryColor}
            teamId={teamId}
          />
        ))}
        
        {members.length === 0 && (
          <Card>
            <div className="p-8 text-center">
              <p className="text-gray-500">No team members yet. Invite your first member to get started.</p>
            </div>
          </Card>
        )}
      </div>

      {/* Invite Member Modal */}
      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        formData={inviteForm}
        setFormData={setInviteForm}
        onSubmit={handleInviteMember}
        roles={roles}
      />
    </div>
  );
}

// Member Row Component
function MemberRow({ 
  member, 
  roles, 
  onUpdateRole, 
  onRemove, 
  getRoleById, 
  getPermissionCategoryColor,
  teamId 
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(member.roleId || '');

  const handleRoleChange = async (roleId) => {
    setIsUpdating(true);
    await onUpdateRole(member.id, roleId);
    setIsUpdating(false);
  };

  const currentRole = getRoleById(member.roleId);
  const isOwner = member.role === 'OWNER';

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
    <Card className="hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {member.name ? member.name.charAt(0).toUpperCase() : member.email.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Member Info */}
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {member.name || 'Unnamed User'}
              </h3>
              <p className="text-sm text-gray-600">{member.email}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge color={isOwner ? 'purple' : 'blue'}>
                  {member.role}
                </Badge>
                {member.joinedAt && (
                  <span className="text-xs text-gray-500">
                    Joined {new Date(member.joinedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Role Selection */}
            {!isOwner && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Role:</span>
                <Select
                  value={selectedRoleId}
                  onChange={(e) => {
                    setSelectedRoleId(e.target.value);
                    handleRoleChange(e.target.value);
                  }}
                  disabled={isUpdating}
                  className="w-40"
                >
                  <option value="">No Role</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </Select>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-2">
              {!isOwner && (
                <Button
                  size="sm"
                  variant="outline"
                  color="red"
                  onClick={() => onRemove(member.id)}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Role Permissions */}
        {currentRole && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Role: {currentRole.name} ({currentRole.permissions.length} permissions)
            </p>
            <div className="flex flex-wrap gap-1">
              {currentRole.permissions.slice(0, 8).map(permission => {
                const category = getCategoryFromPermission(permission);
                const color = getPermissionCategoryColor(category);
                return (
                  <Badge key={permission} color={color} size="sm">
                    {permission.split(':')[1]}
                  </Badge>
                );
              })}
              {currentRole.permissions.length > 8 && (
                <Badge color="gray" size="sm">
                  +{currentRole.permissions.length - 8} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Custom Permissions */}
        {member.customPermissions && member.customPermissions.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Custom Permissions ({member.customPermissions.length})
            </p>
            <div className="flex flex-wrap gap-1">
              {member.customPermissions.map(permission => {
                const category = getCategoryFromPermission(permission);
                const color = getPermissionCategoryColor(category);
                return (
                  <Badge key={permission} color={color} size="sm">
                    {permission.split(':')[1]}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

// Invite Member Modal Component
function InviteMemberModal({ isOpen, onClose, formData, setFormData, onSubmit, roles }) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Invite Team Member</h2>
        
        <div className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email address"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <Select
              value={formData.roleId}
              onChange={(e) => setFormData(prev => ({ ...prev, roleId: e.target.value }))}
            >
              <option value="">Select a role</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>
                  {role.name} - {role.description}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={onSubmit}
            disabled={!formData.email || !formData.roleId}
          >
            Send Invitation
          </Button>
        </div>
      </div>
    </Modal>
  );
} 