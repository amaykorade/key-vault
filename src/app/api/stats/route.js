import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../lib/auth.js';
import { getKeyStats } from '../../../lib/keys.js';
import prisma from '../../../lib/database.js';

export async function GET(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get key statistics
    const keyStats = await getKeyStats(user.id);
    
    // Get folder count
    const folderCount = await prisma.folder.count({
      where: { userId: user.id }
    });

    const stats = {
      totalKeys: keyStats.totalKeys,
      folders: folderCount,
      favorites: keyStats.favoriteKeys
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 