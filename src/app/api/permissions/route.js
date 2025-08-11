import { NextResponse } from 'next/server';
import { PERMISSIONS, PERMISSION_CATEGORIES, getPermissionsByCategory } from '../../../lib/permissions.js';

// Get all permissions
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const format = searchParams.get('format') || 'categorized';
    
    if (format === 'categorized') {
      const categorizedPermissions = getPermissionsByCategory();
      
      if (category && categorizedPermissions[category]) {
        return NextResponse.json({ 
          success: true, 
          category,
          permissions: categorizedPermissions[category]
        });
      }
      
      return NextResponse.json({ 
        success: true, 
        permissions: categorizedPermissions,
        categories: Object.keys(PERMISSION_CATEGORIES)
      });
    } else {
      // Flat format
      const flatPermissions = Object.entries(PERMISSIONS).map(([name, description]) => ({
        name,
        description,
        category: Object.keys(PERMISSION_CATEGORIES).find(cat => 
          PERMISSION_CATEGORIES[cat].includes(name)
        ) || 'other'
      }));
      
      if (category) {
        const filteredPermissions = flatPermissions.filter(p => p.category === category);
        return NextResponse.json({ 
          success: true, 
          category,
          permissions: filteredPermissions
        });
      }
      
      return NextResponse.json({ 
        success: true, 
        permissions: flatPermissions
      });
    }
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch permissions' 
    }, { status: 500 });
  }
} 