'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '../../stores/authStore';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [userPermissions, setUserPermissions] = useState([]);
  const [userRoles, setUserRoles] = useState([]);
  const [rbacLoading, setRbacLoading] = useState(true);

  const fetchUserRBAC = async () => {
    try {
      setRbacLoading(true);
      
      // Fetch user permissions
      const permissionsResponse = await fetch('/api/auth/permissions', {
        credentials: 'include'
      });
      
      if (permissionsResponse.ok) {
        const permissionsData = await permissionsResponse.json();
        setUserPermissions(permissionsData.permissions || []);
      }
      
      // Fetch user roles
      const rolesResponse = await fetch('/api/auth/roles', {
        credentials: 'include'
      });
      
      if (rolesResponse.ok) {
        const rolesData = await rolesResponse.json();
        setUserRoles(rolesData.roles || []);
      }
    } catch (error) {
      console.error('Error fetching RBAC data:', error);
    } finally {
      setRbacLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserRBAC();
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
              <p className="mt-2 text-gray-600">
                Manage your account information and access permissions
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard')}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* User Permissions & Roles */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Your Access</h2>
              <p className="text-sm text-gray-600">Your current permissions and roles</p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* User Roles */}
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Your Roles</h3>
                  {rbacLoading ? (
                    <div className="animate-pulse space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ) : userRoles.length > 0 ? (
                    <div className="space-y-3">
                      {userRoles.map((role, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900">{role.name}</div>
                            <div className="text-sm text-gray-600">{role.description}</div>
                            {role.teamName && (
                              <div className="text-xs text-blue-600">Team: {role.teamName}</div>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {role.permissions.length} permissions
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500">No roles assigned</p>
                    </div>
                  )}
                </div>
              </Card>

              {/* User Permissions */}
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Your Permissions</h3>
                  {rbacLoading ? (
                    <div className="animate-pulse space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ) : userPermissions.length > 0 ? (
                    <div className="space-y-2">
                      {userPermissions.slice(0, 8).map((permission, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                          <span className="text-sm font-medium text-green-800">{permission}</span>
                          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Active</span>
                        </div>
                      ))}
                      {userPermissions.length > 8 && (
                        <div className="text-center py-2">
                          <span className="text-sm text-gray-500">
                            +{userPermissions.length - 8} more permissions
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500">No permissions assigned</p>
                      <p className="text-xs text-gray-400 mt-1">Contact your administrator to get access</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>

          {/* Account Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Information</h2>
            <Card>
              <div className="p-6">
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
            </Card>
          </div>

          {/* Additional Account Actions */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Actions</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Subscription</h3>
                      <p className="text-sm text-gray-600">Manage your plan and billing</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => router.push('/subscription')}
                  >
                    Manage Subscription
                  </Button>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">API Tokens</h3>
                      <p className="text-sm text-gray-600">Manage your API access</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => router.push('/dashboard')}
                  >
                    View Keys
                  </Button>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Security</h3>
                      <p className="text-sm text-gray-600">Update password and settings</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    disabled
                  >
                    Coming Soon
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 