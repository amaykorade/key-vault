'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Badge, Alert, Table } from './ui';

export default function AccessControlDashboard() {
  const [accessStats, setAccessStats] = useState({
    totalUsers: 0,
    totalRoles: 0,
    totalPermissions: 0,
    recentAccess: 0
  });
  const [accessLogs, setAccessLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAccessStats();
    loadAccessLogs();
  }, []);

  const loadAccessStats = async () => {
    try {
      const response = await fetch('/api/rbac/stats');
      const data = await response.json();
      
      if (data.success) {
        setAccessStats(data.stats);
      }
    } catch (error) {
      console.error('Error loading access stats:', error);
    }
  };

  const loadAccessLogs = async () => {
    try {
      const response = await fetch('/api/rbac/audit-logs?limit=20');
      const data = await response.json();
      
      if (data.success) {
        setAccessLogs(data.logs);
      }
    } catch (error) {
      setError('Error loading access logs');
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action) => {
    const colors = {
      'create': 'green',
      'read': 'blue',
      'update': 'yellow',
      'delete': 'red',
      'access_denied': 'red',
      'access_granted': 'green',
      'permission_changed': 'purple'
    };
    return colors[action] || 'gray';
  };

  const getResultColor = (result) => {
    return result === 'success' ? 'green' : result === 'denied' ? 'red' : 'yellow';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Access Control Dashboard</h1>
        <p className="text-gray-600">Monitor and manage access to your Key Vault</p>
      </div>

      {/* Alerts */}
      {error && (
        <Alert type="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AccessCard
          title="Total Users"
          count={accessStats.totalUsers}
          icon="👥"
          color="blue"
        />
        <AccessCard
          title="Active Roles"
          count={accessStats.totalRoles}
          icon="🔐"
          color="green"
        />
        <AccessCard
          title="Permissions"
          count={accessStats.totalPermissions}
          icon="🔑"
          color="purple"
        />
        <AccessCard
          title="Recent Access"
          count={accessStats.recentAccess}
          icon="📊"
          color="orange"
        />
      </div>

      {/* Access Logs */}
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Access Logs</h2>
            <Button variant="outline" size="sm" onClick={loadAccessLogs}>
              Refresh
            </Button>
          </div>

          {accessLogs.length > 0 ? (
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.Header>User</Table.Header>
                  <Table.Header>Action</Table.Header>
                  <Table.Header>Resource</Table.Header>
                  <Table.Header>Result</Table.Header>
                  <Table.Header>IP Address</Table.Header>
                  <Table.Header>Date</Table.Header>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {accessLogs.map(log => (
                  <Table.Row key={log.id}>
                    <Table.Cell>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {log.user?.email?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <span className="text-sm text-gray-900">
                          {log.user?.email || 'Unknown'}
                        </span>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color={getActionColor(log.action)} size="sm">
                        {log.action.replace('_', ' ')}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="text-sm">
                        <span className="font-medium">{log.resourceType}</span>
                        {log.resourceId && (
                          <span className="text-gray-500 ml-1">#{log.resourceId.slice(-8)}</span>
                        )}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color={getResultColor(log.result)} size="sm">
                        {log.result}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-sm text-gray-600">
                        {log.ipAddress || 'N/A'}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-sm text-gray-600">
                        {formatDate(log.createdAt)}
                      </span>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No access logs found</p>
            </div>
          )}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickActionCard
          title="Manage Roles"
          description="Create and manage user roles"
          icon="🔐"
          href="/admin/roles"
          color="blue"
        />
        <QuickActionCard
          title="Team Members"
          description="Assign roles to team members"
          icon="👥"
          href="/admin/teams"
          color="green"
        />
        <QuickActionCard
          title="Audit Reports"
          description="Generate access reports"
          icon="📊"
          href="/admin/audit"
          color="purple"
        />
      </div>
    </div>
  );
}

// Access Card Component
function AccessCard({ title, count, icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700'
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{count}</p>
          </div>
          <div className={`p-3 rounded-full border ${colorClasses[color]}`}>
            <span className="text-xl">{icon}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Quick Action Card Component
function QuickActionCard({ title, description, icon, href, color }) {
  const colorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
    orange: 'bg-orange-600 hover:bg-orange-700',
    red: 'bg-red-600 hover:bg-red-700',
    yellow: 'bg-yellow-600 hover:bg-yellow-700'
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <div className="p-6 text-center">
        <div className={`w-12 h-12 mx-auto mb-4 rounded-full ${colorClasses[color]} flex items-center justify-center`}>
          <span className="text-white text-xl">{icon}</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <Button 
          className={colorClasses[color]}
          onClick={() => window.location.href = href}
        >
          Go to {title}
        </Button>
      </div>
    </Card>
  );
} 