import RoleManagement from '../../../components/RoleManagement.js';
import AdminNavigation from '../../../components/AdminNavigation.js';
import PlanProtectedRoute from '../../../components/PlanProtectedRoute.js';

export default function AdminRolesPage() {
  return (
    <PlanProtectedRoute feature="rbac">
      <div className="min-h-screen bg-gray-50">
        <AdminNavigation />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <RoleManagement />
          </div>
        </div>
      </div>
    </PlanProtectedRoute>
  );
} 