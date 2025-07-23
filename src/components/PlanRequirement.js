'use client';

import Button from './ui/Button';
import Card from './ui/Card';

export default function PlanRequirement({ 
  requiredPlan, 
  currentPlan = 'FREE', 
  message = null,
  showUpgradeButton = true 
}) {
  const getPlanColor = (plan) => {
    switch (plan) {
      case 'FREE': return 'bg-gray-600';
      case 'PRO': return 'bg-blue-600';
      case 'TEAM': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  const getPlanFeatures = (plan) => {
    switch (plan) {
      case 'PRO':
        return ['3 projects', '100 secrets', 'Audit logs', 'API analytics'];
      case 'TEAM':
        return ['Unlimited projects', '1,000+ secrets', 'Team members', 'RBAC'];
      default:
        return [];
    }
  };

  const defaultMessage = `This feature requires a ${requiredPlan} plan subscription.`;
  const displayMessage = message || defaultMessage;

  return (
    <Card className="border border-yellow-600 bg-yellow-900/20">
      <div className="text-center py-8">
        <div className="mb-4">
          <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Plan Required</h3>
          <p className="text-gray-300 mb-4">{displayMessage}</p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="text-center">
              <span className={`${getPlanColor(currentPlan)} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                Current: {currentPlan}
              </span>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <div className="text-center">
              <span className={`${getPlanColor(requiredPlan)} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                Required: {requiredPlan}
              </span>
            </div>
          </div>

          {getPlanFeatures(requiredPlan).length > 0 && (
            <div className="text-left max-w-md mx-auto">
              <div className="text-gray-300 text-sm mb-2">With {requiredPlan} plan you get:</div>
              <ul className="space-y-1">
                {getPlanFeatures(requiredPlan).map((feature, index) => (
                  <li key={index} className="text-white text-sm flex items-center">
                    <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {showUpgradeButton && (
          <div className="space-y-3">
            <Button
              onClick={() => window.location.href = '/pricing'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            >
              Upgrade to {requiredPlan} Plan
            </Button>
            <div className="text-xs text-gray-400">
              Starting at ${requiredPlan === 'PRO' ? '9' : '29'}/month
            </div>
          </div>
        )}
      </div>
    </Card>
  );
} 