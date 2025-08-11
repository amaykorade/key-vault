import { NextResponse } from 'next/server';
import { initializeRBAC } from '../../../../lib/permissions.js';

export async function POST(request) {
  try {
    console.log('🚀 Initializing RBAC system...');
    
    const success = await initializeRBAC();
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'RBAC system initialized successfully' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to initialize RBAC system' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error initializing RBAC:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 