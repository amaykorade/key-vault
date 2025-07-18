import { NextResponse } from 'next/server'
import { validateSession } from '../../../../lib/auth'
import { getFolder } from '../../../../lib/folders'

export async function GET(request, { params }) {
  try {
    const { id: folderId } = params
    const sessionToken = request.cookies.get('session_token')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Validate session
    const user = await validateSession(sessionToken)
    
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid or expired session' },
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