'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/authStore';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import PlanRequirement from '@/components/PlanRequirement';
import PlanProtectedRoute from '@/components/PlanProtectedRoute.js';

export default function TeamsPage() {
  return (
    <PlanProtectedRoute feature="teamFeatures">
      <TeamsPageContent />
    </PlanProtectedRoute>
  );
}

function TeamsPageContent() {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', description: '' });
  const [creating, setCreating] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/auth/login');
      return;
    }
    
    if (isAuthenticated) {
      fetchTeams();
      fetchSubscription();
    }
  }, [isAuthenticated, isLoading, router]);

  const fetchSubscription = async () => {
    try {
      setSubscriptionLoading(true);
      const response = await fetch('/api/subscription', {
        credentials: 'include'
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch subscription');
      }

      setSubscription(data.subscription);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setSubscriptionLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/teams');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch teams');
      }

      setTeams(data.teams);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    
    if (!createForm.name.trim()) {
      setError('Team name is required');
      return;
    }

    try {
      setCreating(true);
      setError(null);

      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create team');
      }

      setTeams([data.team, ...teams]);
      setCreateForm({ name: '', description: '' });
      setShowCreateModal(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (!confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/teams/${teamId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete team');
      }

      setTeams(teams.filter(team => team.id !== teamId));
    } catch (error) {
      setError(error.message);
    }
  };

  const getRoleBadge = (team, userId) => {
    const member = team.team_members?.find(m => m.user.id === userId);
    if (member) {
      const roleColors = {
        'OWNER': 'bg-red-600',
        'ADMIN': 'bg-purple-600',
        'MEMBER': 'bg-blue-600'
      };
      return (
        <span className={`${roleColors[member.role]} text-white px-2 py-1 rounded-full text-xs font-medium`}>
          {member.role}
        </span>
      );
    }
    
    return null;
  };

  // Check if user can create teams
  const canCreateTeam = subscription && subscription.plan === 'TEAM' && subscription.isActive;

  if (loading || subscriptionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto py-8 px-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-lg p-6 h-48 border border-gray-200"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto py-8 px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Teams</h1>
            <p className="text-gray-600">Manage your teams and share keys with members</p>
          </div>
          {canCreateTeam ? (
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Create Team
            </Button>
          ) : (
            <div className="text-right">
              <Button 
                disabled
                className="bg-gray-300 text-gray-500 cursor-not-allowed"
                title="Team functionality requires an active TEAM plan subscription"
              >
                Create Team
              </Button>
              <div className="text-sm text-gray-500 mt-1">
                Requires TEAM plan
              </div>
            </div>
          )}
        </div>

        {!canCreateTeam && (
          <PlanRequirement 
            requiredPlan="TEAM"
            message="Team functionality requires an active TEAM plan subscription. Please upgrade your plan to create and manage teams."
          />
        )}

        {error && error.includes('TEAM plan') ? (
          <PlanRequirement 
            requiredPlan="TEAM"
            message="Team functionality requires an active TEAM plan subscription. Please upgrade your plan."
          />
        ) : error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-medium mb-1">Error</div>
                <div className="text-sm">{error}</div>
              </div>
            </div>
          </div>
        )}

        {teams.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No teams yet</h3>
            <p className="text-gray-600 mb-4">
              {canCreateTeam 
                ? "Create your first team to start sharing keys with your colleagues"
                : "Upgrade to TEAM plan to create teams and share keys with your colleagues"
              }
            </p>
            {canCreateTeam ? (
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Create Your First Team
              </Button>
            ) : (
              <Button 
                onClick={() => window.location.href = '/pricing'}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Upgrade to TEAM Plan
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map(team => (
              <Card key={team.id} className="hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{team.name}</h3>
                    {team.description && (
                      <p className="text-gray-600 text-sm">{team.description}</p>
                    )}
                  </div>
                  {getRoleBadge(team, team.owner.id)}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {team._count.members} member{team._count.members !== 1 ? 's' : ''}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    {team._count.keyAccesses} shared key{team._count.keyAccesses !== 1 ? 's' : ''}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={() => router.push(`/teams/${team.id}`)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm"
                  >
                    Manage
                  </Button>
                  {team.ownerId === team.owner.id && (
                    <Button
                      onClick={() => handleDeleteTeam(team.id)}
                      className="bg-red-600 hover:bg-red-700 text-white text-sm px-3"
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Team</h2>
            
            <form onSubmit={handleCreateTeam}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Name *
                  </label>
                  <Input
                    type="text"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    placeholder="Enter team name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    placeholder="Optional team description"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <Button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={creating}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {creating ? 'Creating...' : 'Create Team'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
      </div>
  );
} 