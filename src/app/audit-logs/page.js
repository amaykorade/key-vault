'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '../../stores/authStore';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import PlanProtectedRoute from '../../components/PlanProtectedRoute.js';

export default function AuditLogsPage() {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedLogs, setExpandedLogs] = useState(new Set());
  const [filters, setFilters] = useState({
    action: '',
    resource: '',
    startDate: '',
    endDate: ''
  });
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/auth/login');
      return;
    }
    
    if (isAuthenticated) {
      fetchAuditLogs();
    }
  }, [isAuthenticated, isLoading, router]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.action) params.append('action', filters.action);
      if (filters.resource) params.append('resource', filters.resource);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      
      const response = await fetch(`/api/audit-logs?${params}`);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403 && data.upgradeRequired) {
          setError('Audit logs require PRO plan or higher. Please upgrade your plan.');
        } else {
          throw new Error(data.error || 'Failed to fetch audit logs');
        }
        return;
      }

      setAuditLogs(data.auditLogs);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchAuditLogs();
  };

  const clearFilters = () => {
    setFilters({
      action: '',
      resource: '',
      startDate: '',
      endDate: ''
    });
    fetchAuditLogs();
  };

  const getActionColor = (action) => {
    const colors = {
      CREATE: 'bg-green-100 text-green-800',
      READ: 'bg-blue-100 text-blue-800',
      UPDATE: 'bg-yellow-100 text-yellow-800',
      DELETE: 'bg-red-100 text-red-800',
      LOGIN: 'bg-purple-100 text-purple-800',
      LOGOUT: 'bg-gray-100 text-gray-800',
      GENERATE: 'bg-indigo-100 text-indigo-800',
      ERROR: 'bg-red-100 text-red-800'
    };
    return colors[action] || 'bg-gray-100 text-gray-800';
  };

  const toggleLogExpansion = (logId) => {
    setExpandedLogs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(logId)) {
        newSet.delete(logId);
      } else {
        newSet.add(logId);
      }
      return newSet;
    });
  };

  const hasEnhancedDetails = (log) => {
    return log.details && Object.keys(log.details).length > 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto py-8 px-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-lg p-6 h-20 border border-gray-200"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PlanProtectedRoute feature="apiAnalytics">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto py-8 px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Audit Logs</h1>
            <p className="text-gray-600">Track all activities and API usage in your account</p>
          </div>

          {error && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <div className="text-red-700">
                <div className="font-medium mb-1">Error</div>
                <div className="text-sm">{error}</div>
              </div>
            </Card>
          )}

          {/* Filters */}
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
                <select
                  value={filters.action}
                  onChange={(e) => handleFilterChange('action', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                >
                  <option value="" className="text-gray-900">All Actions</option>
                  <option value="CREATE" className="text-gray-900">Create</option>
                  <option value="READ" className="text-gray-900">Read</option>
                  <option value="UPDATE" className="text-gray-900">Update</option>
                  <option value="DELETE" className="text-gray-900">Delete</option>
                  <option value="LOGIN" className="text-gray-900">Login</option>
                  <option value="LOGOUT" className="text-gray-900">Logout</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resource</label>
                <select
                  value={filters.resource}
                  onChange={(e) => handleFilterChange('resource', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                >
                  <option value="" className="text-gray-900">All Resources</option>
                  <option value="key" className="text-gray-900">Keys</option>
                  <option value="folder" className="text-gray-900">Folders</option>
                  <option value="user" className="text-gray-900">User</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-4">
              <Button onClick={applyFilters} className="bg-blue-600 hover:bg-blue-700 text-white">
                Apply Filters
              </Button>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          </Card>

          {/* Audit Logs */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Activity Log</h3>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  {auditLogs.length} entries
                  {auditLogs.filter(log => hasEnhancedDetails(log)).length > 0 && (
                    <span className="ml-2 text-blue-600">
                      ({auditLogs.filter(log => hasEnhancedDetails(log)).length} with enhanced details)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {auditLogs.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No audit logs found</h3>
                <p className="text-gray-600">Start using your account to see activity logs here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div key={log.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                        <div>
                          <div className="font-medium text-gray-900">
                            {log.action} {log.resource}
                            {log.details?.resourceName && (
                              <span className="text-gray-600 ml-2">&ldquo;{log.details.resourceName}&rdquo;</span>
                            )}
                            {log.resourceId && <span className="text-gray-500 ml-2">#{log.resourceId.slice(-8)}</span>}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(log.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-500">
                          {log.ipAddress && <div>IP: {log.ipAddress}</div>}
                        </div>
                        {hasEnhancedDetails(log) && (
                          <button
                            onClick={() => toggleLogExpansion(log.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            {expandedLogs.has(log.id) ? 'Hide Details' : 'Show Details'}
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Enhanced Details (Expandable) */}
                    {expandedLogs.has(log.id) && hasEnhancedDetails(log) && (
                      <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          {/* User Information */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">User Information</h4>
                            <div className="space-y-1 text-gray-600">
                              <div>User: {log.users?.name || log.users?.email}</div>
                              {log.details?.userRole && <div>Role: {log.details.userRole}</div>}
                              {log.details?.userPlan && <div>Plan: {log.details.userPlan}</div>}
                              {log.details?.authMethod && <div>Auth: {log.details.authMethod}</div>}
                              {log.details?.userEmail && <div>Email: {log.details.userEmail}</div>}
                              {log.details?.loginMethod && <div>Login: {log.details.loginMethod}</div>}
                            </div>
                          </div>

                          {/* Resource Details */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Resource Details</h4>
                            <div className="space-y-1 text-gray-600">
                              {log.details?.keyType && <div>Type: {log.details.keyType}</div>}
                              {log.details?.folderName && <div>Folder: {log.details.folderName}</div>}
                              {log.details?.isProject && <div>Project: Yes</div>}
                              {log.details?.tags && log.details.tags.length > 0 && (
                                <div>Tags: {log.details.tags.join(', ')}</div>
                              )}
                              {log.details?.description && <div>Description: {log.details.description}</div>}
                            </div>
                          </div>

                          {/* Request Details */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Request Details</h4>
                            <div className="space-y-1 text-gray-600">
                              {log.details?.method && <div>Method: {log.details.method}</div>}
                              {log.details?.endpoint && <div>Endpoint: {log.details.endpoint}</div>}
                              {log.details?.statusCode && <div>Status: {log.details.statusCode}</div>}
                              {log.details?.responseTime && <div>Response: {log.details.responseTime}ms</div>}
                              {log.details?.timestamp && <div>Timestamp: {new Date(log.details.timestamp).toLocaleString()}</div>}
                            </div>
                          </div>

                          {/* Additional Context */}
                          {(log.details?.changes || log.details?.errorMessage || log.details?.permissions) && (
                            <div className="md:col-span-2 lg:col-span-3">
                              <h4 className="font-medium text-gray-900 mb-2">Additional Context</h4>
                              <div className="space-y-1 text-gray-600">
                                {log.details?.changes && (
                                  <div>Changes: <pre className="text-xs bg-gray-100 p-2 rounded">{JSON.stringify(log.details.changes, null, 2)}</pre></div>
                                )}
                                {log.details?.permissions && (
                                  <div>Permissions: <span className="text-xs bg-blue-100 px-2 py-1 rounded">{log.details.permissions.join(', ')}</span></div>
                                )}
                                {log.details?.errorMessage && (
                                  <div className="text-red-600">Error: {log.details.errorMessage}</div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Basic Details (Always Visible) */}
                    <div className="p-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div>
                          <span className="font-medium">User:</span> {log.users?.name || log.users?.email}
                          {log.details?.userRole && <span className="ml-4"><span className="font-medium">Role:</span> {log.details.userRole}</span>}
                          {log.details?.userPlan && <span className="ml-4"><span className="font-medium">Plan:</span> {log.details.userPlan}</span>}
                        </div>
                        <div>
                          {log.details?.method && <span className="mr-4"><span className="font-medium">Method:</span> {log.details.method}</span>}
                          {log.details?.endpoint && <span className="mr-4"><span className="font-medium">Endpoint:</span> {log.details.endpoint}</span>}
                          {log.details?.statusCode && <span><span className="font-medium">Status:</span> {log.details.statusCode}</span>}
                        </div>
                      </div>
                      {log.details?.description && (
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Description:</span> {log.details.description}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </PlanProtectedRoute>
  );
} 