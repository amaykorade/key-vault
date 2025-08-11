import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../lib/auth.js';
import { hasFeature, getPlanLimits } from '../../../../lib/planLimits.js';

export async function GET(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const planLimits = getPlanLimits(user.plan);
    
    const features = {
      plan: user.plan,
      planName: planLimits.name,
      teamFeatures: hasFeature(user, 'team_features'),
      rbac: hasFeature(user, 'rbac'),
      expiringSecrets: hasFeature(user, 'expiring_secrets'),
      apiAnalytics: hasFeature(user, 'apiAnalytics'),
      emailSupport: hasFeature(user, 'email_support'),
      prioritySupport: hasFeature(user, 'priority_support'),
      limits: {
        maxProjects: planLimits.maxProjects,
        maxKeysPerProject: planLimits.maxKeysPerProject,
        maxKeysTotal: planLimits.maxKeysTotal
      },
      features: planLimits.features,
      restrictions: planLimits.restrictions,
      price: planLimits.price
    };

    return NextResponse.json({ 
      success: true,
      features 
    });

  } catch (error) {
    console.error('Error fetching user features:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 