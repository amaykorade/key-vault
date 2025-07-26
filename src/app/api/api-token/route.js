import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../lib/auth';
import prisma from '../../../lib/database';

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
  return NextResponse.json({ token: newToken });
} 

