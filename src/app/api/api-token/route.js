import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../lib/auth.js';
import prisma from '../../../lib/database.js';
import { logAccess } from '../../../lib/permissions.js';
import crypto from 'crypto';

function generateToken(userId) {
  // Use a secure random generator with better format
  const randomPart = crypto.randomBytes(16).toString('hex');
  return 'tok_' + userId + '_' + randomPart;
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
    await logAccess(user.id, 'api_token', null, 'generate', 'success', {
      tokenType: 'legacy',
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      userAgent: request.headers.get('user-agent')
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

