import TeamMemberManagement from '../../../components/TeamMemberManagement.js';
import AdminNavigation from '../../../components/AdminNavigation.js';
import PlanProtectedRoute from '../../../components/PlanProtectedRoute.js';

export default function AdminTeamsPage() {
  // For now, we'll use a default team ID. In a real app, this would come from the URL or user context
  const defaultTeamId = 'default-team-id';

  return (
    <PlanProtectedRoute feature="teamFeatures">
      <div className="min-h-screen bg-gray-50">
        <AdminNavigation />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <TeamMemberManagement teamId={defaultTeamId} />
          </div>
        </div>
      </div>
    </PlanProtectedRoute>
  );
} 