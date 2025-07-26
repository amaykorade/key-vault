'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import useAuthStore from '../../stores/authStore'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import SubscriptionStatus from '../../components/SubscriptionStatus'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, logout } = useAuthStore()
  const [projects, setProjects] = useState([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    color: '#3B82F6'
  })
  const [creatingProject, setCreatingProject] = useState(false)
  const [userPlan, setUserPlan] = useState('FREE');
  const [projectCount, setProjectCount] = useState(0);
  const [countLoading, setCountLoading] = useState(false);
  const [stats, setStats] = useState({ totalKeys: 0, folders: 0, favorites: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  // Fetch user plan and project count
  const fetchPlanAndProjectCount = async () => {
    setCountLoading(true);
    try {
      // Fetch user info
      const userRes = await fetch('/api/auth/me', { credentials: 'include' });
      const userData = await userRes.json();
      setUserPlan(userData.user?.plan || 'FREE');
      // Fetch all projects
      const projectsRes = await fetch('/api/folders', { credentials: 'include' });
      const projectsData = await projectsRes.json();
      setProjectCount(projectsData.folders?.length || 0);
    } catch (err) {
      setUserPlan('FREE');
      setProjectCount(0);
    } finally {
      setCountLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await fetch('/api/stats', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data immediately since middleware ensures we're authenticated
      fetchProjects()
      fetchStats()
  }, [])

  useEffect(() => {
    if (showCreateProject) {
      fetchPlanAndProjectCount();
    }
  }, [showCreateProject]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/folders', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setProjects(data.folders)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoadingProjects(false)
    }
  }

  const handleCreateProject = async (e) => {
    e.preventDefault();
    await fetchPlanAndProjectCount(); // Always check before submit
    
    if (userPlan === 'FREE' && projectCount >= 1) {
      alert('Free plan users can only create 1 project. Please upgrade to add more.');
      return;
    }
    
    setCreatingProject(true);
    try {
      const response = await fetch('/api/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newProject),
      });

      if (response.ok) {
        setNewProject({ name: '', description: '', color: '#3B82F6' });
        setShowCreateProject(false);
        fetchProjects(); // Refresh the projects list
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project');
    } finally {
      setCreatingProject(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/auth/login');
  }
  };

  // Show loading only briefly while data loads
  if (loadingProjects && projects.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name || 'User'}!
              </h1>
              <p className="mt-2 text-gray-600">
                Manage your secure keys and passwords
              </p>
            </div>
            <div className="flex space-x-4">
              <Button 
                onClick={() => setShowCreateProject(true)}
                variant="primary"
              >
                Create Project
              </Button>
              {user?.role === 'ADMIN' && (
                <Link href="/admin/users">
                  <Button variant="secondary">
                    Manage Users
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Statistics Section - Moved above projects */}
          <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="bg-white overflow-hidden shadow-lg rounded-lg border border-gray-200">
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
                      <dt className="text-sm font-medium text-gray-600 truncate">
                        Total Keys
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {statsLoading ? (
                          <div className="animate-pulse bg-gray-300 h-6 w-8 rounded"></div>
                        ) : (
                          stats.totalKeys
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-lg rounded-lg border border-gray-200">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-600 truncate">
                        Folders
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {statsLoading ? (
                          <div className="animate-pulse bg-gray-300 h-6 w-8 rounded"></div>
                        ) : (
                          stats.folders
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-lg rounded-lg border border-gray-200">
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
                      <dt className="text-sm font-medium text-gray-600 truncate">
                        Favorites
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {statsLoading ? (
                          <div className="animate-pulse bg-gray-300 h-6 w-8 rounded"></div>
                        ) : (
                          stats.favorites
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Your Projects</h2>
            </div>
            
            {loadingProjects ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : projects.length === 0 ? (
              <Card>
                <div className="text-center py-8">
                  <div className="mx-auto h-12 w-12 text-gray-400">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                    </svg>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating your first project.</p>
                  <div className="mt-6">
                    <Button
                      onClick={() => setShowCreateProject(true)}
                      variant="primary"
                    >
                      Create Project
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: project.color }}
                        ></div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                          <p className="text-sm text-gray-600">{project.description || 'No description'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(project.id);
                          // You could add a toast notification here
                        }}
                        className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 hover:text-gray-700 transition-colors cursor-pointer"
                        title="Click to copy folder ID"
                      >
                        ID: {project.id}
                      </button>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {project._count?.keys || 0} keys
                      </span>
                      <Link href={`/projects/${project.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Account Information */}
          <div className="bg-white overflow-hidden shadow-lg rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Account Information
              </h3>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-600">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user?.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600">Role</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{user?.role}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600">User ID</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono">{user?.id}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Subscription Status */}
          <div className="mt-6">
            <SubscriptionStatus />
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      {showCreateProject && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Project</h3>
              <form onSubmit={handleCreateProject}>
                <div className="space-y-4">
                  <Input
                    label="Project Name"
                    name="name"
                    type="text"
                    placeholder="Enter project name"
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    required
                  />
                  
                  <Input
                    label="Description"
                    name="description"
                    type="text"
                    placeholder="Enter project description (optional)"
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Color
                    </label>
                    <div className="flex space-x-2">
                      {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'].map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`w-8 h-8 rounded-full border-2 ${
                            newProject.color === color ? 'border-gray-900' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setNewProject({...newProject, color})}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                {userPlan === 'FREE' && projectCount >= 1 && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md mb-2 mt-4 border border-red-200">
                    Free plan users can only create 1 project. <a href="/pricing" className="text-blue-600 underline">Upgrade to add more.</a>
                  </div>
                )}
                <div className="flex justify-end space-x-3 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateProject(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={creatingProject}
                    disabled={creatingProject || (userPlan === 'FREE' && projectCount >= 1) || countLoading}
                  >
                    Create Project
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 