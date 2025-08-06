import { NextResponse } from 'next/server'
import { getCurrentUser } from '../../../../lib/auth'
import { getFolder, deleteFolder } from '../../../../lib/folders'

export async function GET(request, context) {
  try {
    const params = await context.params;
    const { id: folderId } = params;
    
    const user = await getCurrentUser(request)
    
    if (!user) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get folder details
    const folder = await getFolder(folderId, user.id)
    
    if (!folder) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      folder,
      keys: folder.keys || []
    })

  } catch (error) {
    console.error('Folder fetch error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, context) {
  try {
    const params = await context.params;
    const { id: folderId } = params;
    
    const user = await getCurrentUser(request)
    
    if (!user) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Delete folder
    const success = await deleteFolder(folderId, user.id)
    
    if (!success) {
      return NextResponse.json(
        { message: 'Project not found or could not be deleted' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      message: 'Project deleted successfully' 
    })

  } catch (error) {
    console.error('Folder deletion error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 