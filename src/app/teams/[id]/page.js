'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import PlanRequirement from '@/components/PlanRequirement';

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showShareKeyModal, setShowShareKeyModal] = useState(false);
  const [addMemberForm, setAddMemberForm] = useState({ email: '', role: 'MEMBER' });
  const [shareKeyForm, setShareKeyForm] = useState({ keyId: '', permissions: ['READ'] });
  const [userKeys, setUserKeys] = useState([]);
  const [addingMember, setAddingMember] = useState(false);
  const [sharingKey, setSharingKey] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchTeam();
      fetchUserKeys();
    }
  }, [params.id]);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/teams/${params.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch team');
      }

      setTeam(data.team);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserKeys = async () => {
    try {
      const response = await fetch('/api/keys?folderId=all');
      const data = await response.json();

      if (response.ok) {
        setUserKeys(data.keys || []);
      }
    } catch (error) {
      console.error('Error fetching user keys:', error);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    
    if (!addMemberForm.email.trim()) {
      setError('Email is required');
      return;
    }

    try {
      setAddingMember(true);
      setError(null);

      const response = await fetch(`/api/teams/${params.id}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addMemberForm)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add member');
      }

      setTeam({
        ...team,
        members: [...teams.members, data.member]
      });
      setAddMemberForm({ email: '', role: 'MEMBER' });
      setShowAddMemberModal(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!confirm('Are you sure you want to remove this member from the team?')) {
      return;
    }

    try {
      const response = await fetch(`/api/teams/${params.id}/members?memberId=${memberId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to remove member');
      }

      setTeam({
        ...team,
        members: team.team_members.filter(member => member.id !== memberId)
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleShareKey = async (e) => {
    e.preventDefault();
    
    if (!shareKeyForm.keyId) {
      setError('Please select a key');
      return;
    }

    try {
      setSharingKey(true);
      setError(null);

      const response = await fetch(`/api/teams/${params.id}/keys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shareKeyForm)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to share key');
      }

      setTeam({
        ...team,
        keyAccesses: [...teams.keyAccesses, data.keyAccess]
      });
      setShareKeyForm({ keyId: '', permissions: ['READ'] });
      setShowShareKeyModal(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setSharingKey(false);
    }
  };

  const handleRevokeKey = async (keyId) => {
    if (!confirm('Are you sure you want to revoke access to this key?')) {
      return;
    }

    try {
      const response = await fetch(`/api/teams/${params.id}/keys?keyId=${keyId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to revoke key access');
      }

      setTeam({
        ...team,
        keyAccesses: team.keyAccesses.filter(access => access.keyId !== keyId)
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const getRoleBadge = (role) => {
    const roleColors = {
      'OWNER': 'bg-purple-600',
      'ADMIN': 'bg-red-600',
      'MEMBER': 'bg-blue-600'
    };
    return (
      <span className={`${roleColors[role]} text-white px-2 py-1 rounded-full text-xs font-medium`}>
        {role}
      </span>
    );
  };

  const getPermissionBadges = (permissions) => {
    return permissions.map(permission => (
      <span key={permission} className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium mr-1">
        {permission}
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-6xl mx-auto py-8 px-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="bg-gray-800 rounded-lg p-6 h-96"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-6xl mx-auto py-8 px-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Team not found</h1>
            <Button onClick={() => router.push('/teams')} className="bg-blue-600 hover:bg-blue-700 text-white">
              Back to Teams
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-6xl mx-auto py-8 px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{team.name}</h1>
            {team.description && (
              <p className="text-gray-400">{team.description}</p>
            )}
          </div>
          <Button 
            onClick={() => router.push('/teams')}
            className="bg-gray-600 hover:bg-gray-700 text-white"
          >
            Back to Teams
          </Button>
        </div>

        {error && error.includes('TEAM plan') ? (
          <PlanRequirement 
            requiredPlan="TEAM"
            message="Team functionality requires an active TEAM plan subscription. Please upgrade your plan."
          />
        ) : error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-medium mb-1">Error</div>
                <div className="text-sm">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-700 mb-6">
          <nav className="flex space-x-8">
            {['overview', 'members', 'keys'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">{team._count.members}</div>
                <div className="text-gray-400">Team Members</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">{team._count.keyAccesses}</div>
                <div className="text-gray-400">Shared Keys</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">{team.owner.name}</div>
                <div className="text-gray-400">Team Owner</div>
              </div>
            </Card>
          </div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Team Members</h2>
              <Button 
                onClick={() => setShowAddMemberModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add Member
              </Button>
            </div>

            <div className="space-y-4">
              {team.team_members.map(member => (
                <Card key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {member.user.name ? member.user.name[0].toUpperCase() : member.user.email[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-white font-medium">{member.user.name || 'No name'}</div>
                      <div className="text-gray-400 text-sm">{member.user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getRoleBadge(member.role)}
                    {member.userId !== team.ownerId && (
                      <Button
                        onClick={() => handleRemoveMember(member.id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Keys Tab */}
        {activeTab === 'keys' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Shared Keys</h2>
              <Button 
                onClick={() => setShowShareKeyModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Share Key
              </Button>
            </div>

            <div className="space-y-4">
              {team.keyAccesses.map(access => (
                <Card key={access.id} className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">{access.key.name}</div>
                    <div className="text-gray-400 text-sm">{access.key.description}</div>
                    <div className="mt-2">
                      {getPermissionBadges(access.permissions)}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleRevokeKey(access.keyId)}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm"
                  >
                    Revoke
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <h2 className="text-xl font-semibold text-white mb-4">Add Team Member</h2>
            
            <form onSubmit={handleAddMember}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    value={addMemberForm.email}
                    onChange={(e) => setAddMemberForm({ ...addMemberForm, email: e.target.value })}
                    placeholder="Enter member's email"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Role
                  </label>
                  <select
                    value={addMemberForm.role}
                    onChange={(e) => setAddMemberForm({ ...addMemberForm, role: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="MEMBER">Member</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <Button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={addingMember}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {addingMember ? 'Adding...' : 'Add Member'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Share Key Modal */}
      {showShareKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <h2 className="text-xl font-semibold text-white mb-4">Share Key with Team</h2>
            
            <form onSubmit={handleShareKey}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Key *
                  </label>
                  <select
                    value={shareKeyForm.keyId}
                    onChange={(e) => setShareKeyForm({ ...shareKeyForm, keyId: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Choose a key...</option>
                    {userKeys.map(key => (
                      <option key={key.id} value={key.id}>{key.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Permissions
                  </label>
                  <div className="space-y-2">
                    {['READ', 'WRITE', 'DELETE'].map(permission => (
                      <label key={permission} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={shareKeyForm.permissions.includes(permission)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setShareKeyForm({
                                ...shareKeyForm,
                                permissions: [...shareKeyForm.permissions, permission]
                              });
                            } else {
                              setShareKeyForm({
                                ...shareKeyForm,
                                permissions: shareKeyForm.permissions.filter(p => p !== permission)
                              });
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-gray-300">{permission}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <Button
                  type="button"
                  onClick={() => setShowShareKeyModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={sharingKey}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {sharingKey ? 'Sharing...' : 'Share Key'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
} 