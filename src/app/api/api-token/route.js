import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../lib/auth.js';
import prisma from '../../../lib/database.js';
import { logAccess } from '../../../lib/permissions.js';

function generateToken(userId) {
  // Use a secure random generator in production
  return 'tok_' + userId + '_' + Math.random().toString(36).slice(2, 18);
}

export async function GET(request) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Fetch from DB
  const dbUser = await prisma.users.findUnique({ where: { id: user.id } });
  if (!dbUser.apiToken) {
    // Generate and save if missing
    const newToken = generateToken(user.id);
    await prisma.users.update({ where: { id: user.id }, data: { apiToken: newToken } });
    
    // Log token generation
    // Log the token generation/regeneration with enhanced details
    await logAPITokenGeneration(user.id, {
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      userAgent: request.headers.get('user-agent'),
      method: 'GET',
      endpoint: '/api/api-token',
      statusCode: 200
    }, {
      userEmail: user.email,
      userRole: user.role,
      userPlan: user.plan
    });
    
    return NextResponse.json({ token: newToken });
  }
  return NextResponse.json({ token: dbUser.apiToken });
}

export async function POST(request) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const newToken = generateToken(user.id);
  await prisma.users.update({ where: { id: user.id }, data: { apiToken: newToken } });
  
  // Log token regeneration
  await logAccess(user.id, 'api_token', null, 'regenerate', 'success', {
    tokenType: 'legacy',
    ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
    userAgent: request.headers.get('user-agent')
  });
  
  return NextResponse.json({ token: newToken });
} 

