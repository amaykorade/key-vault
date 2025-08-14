import { NextResponse } from 'next/server'
import { getCurrentUser } from '../../../lib/auth'
import prisma from '../../../lib/database'

export async function GET(request) {
  try {
    // Get current user
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Unauthorized',
          message: 'Authentication required. Please provide a valid API token.',
          status: 401
        },
        { status: 401 }
      )
    }

    // Check if user has permission to read
    if (user.permissions && Array.isArray(user.permissions)) {
      if (!user.permissions.includes('keys:read') && !user.permissions.includes('folders:read') && !user.permissions.includes('*')) {
        return NextResponse.json({ 
          success: false,
          error: 'Insufficient permissions',
          message: 'You need keys:read or folders:read permission to access this resource.',
          requiredPermissions: ['keys:read', 'folders:read'],
          status: 403
        }, { status: 403 })
      }
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const path = searchParams.get('path')
    const environment = searchParams.get('environment')
    const type = searchParams.get('type') || 'auto' // auto, key, folder, project

    // Validate required parameters
    if (!path) {
      return NextResponse.json({
        success: false,
        error: 'Missing path parameter',
        message: 'Path parameter is required. Use ?path=ProjectName/Environment/Subfolder',
        examples: [
          '?path=Webmeter/Database/DB_URL&environment=production',
          '?path=MyApp/Development/API_Keys&environment=development',
          '?path=ProjectName&environment=staging'
        ],
        status: 400
      }, { status: 400 })
    }

    // Validate path format
    if (path.trim() === '') {
      return NextResponse.json({
        success: false,
        error: 'Invalid path',
        message: 'Path cannot be empty or contain only whitespace',
        status: 400
      }, { status: 400 })
    }

    // Parse the path
    const pathParts = path.split('/').filter(part => part.trim())
    
    if (pathParts.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Invalid path format',
        message: 'Path format is invalid. Use format: ProjectName/Environment/Subfolder',
        examples: [
          'Webmeter/Database/DB_URL',
          'MyApp/Development/API_Keys',
          'ProjectName'
        ],
        status: 400
      }, { status: 400 })
    }

    // Check path length limits
    if (pathParts.length > 10) {
      return NextResponse.json({
        success: false,
        error: 'Path too deep',
        message: 'Path cannot exceed 10 levels deep for performance reasons',
        currentDepth: pathParts.length,
        maxDepth: 10,
        status: 400
      }, { status: 400 })
    }

    const projectName = pathParts[0]
    const remainingPath = pathParts.slice(1)

    console.log('🔍 Access request:', { path, environment, type, projectName, remainingPath })

    // Find the project (root folder) by name
    const project = await prisma.folders.findFirst({
      where: {
        name: projectName,
        userId: user.id,
        parentId: null // Root level project
      }
    })

    if (!project) {
      // Get available projects for better error message
      const availableProjects = await prisma.folders.findMany({
        where: {
          userId: user.id,
          parentId: null
        },
        select: {
          name: true,
          description: true
        }
      })

      return NextResponse.json({
        success: false,
        error: 'Project not found',
        message: `Project "${projectName}" not found or you don't have access to it`,
        suggestions: [
          'Check if the project name is spelled correctly',
          'Verify you have access to this project',
          'Ensure the project exists in your account'
        ],
        path: path,
        project: projectName,
        availableProjects: availableProjects.map(p => ({ name: p.name, description: p.description })),
        status: 404
      }, { status: 404 })
    }

    // If only project name provided, return project info
    if (remainingPath.length === 0) {
      const projectKeys = await prisma.keys.findMany({
        where: {
          folderId: project.id,
          userId: user.id,
          ...(environment && { environment: environment })
        },
        select: {
          id: true,
          name: true,
          description: true,
          type: true,
          environment: true,
          tags: true,
          isFavorite: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: { updatedAt: 'desc' }
      })

      const projectSubfolders = await prisma.folders.findMany({
        where: {
          userId: user.id,
          parentId: project.id
        },
        select: {
          id: true,
          name: true,
          description: true,
          color: true,
          createdAt: true
        },
        orderBy: { name: 'asc' }
      })

      return NextResponse.json({
        success: true,
        type: 'project',
        path: path,
        project: {
          id: project.id,
          name: project.name,
          description: project.description,
          color: project.color
        },
        environment: environment || 'all',
        totalKeys: projectKeys.length,
        totalSubfolders: projectSubfolders.length,
        keys: projectKeys,
        subfolders: projectSubfolders,
        message: `Successfully accessed project "${projectName}"`
      })
    }

    // Navigate through the folder hierarchy
    let currentParentId = project.id
    let folderPath = [projectName]
    let targetFolder = null

    for (let i = 0; i < remainingPath.length; i++) {
      const folderName = remainingPath[i]
      
      // Find the subfolder
      const subfolder = await prisma.folders.findFirst({
        where: {
          name: folderName,
          userId: user.id,
          parentId: currentParentId
        }
      })

      if (!subfolder) {
        // Get available subfolders at this level
        const availableSubfolders = await prisma.folders.findMany({
          where: {
            userId: user.id,
            parentId: currentParentId
          },
          select: {
            name: true,
            description: true
          }
        })

        return NextResponse.json({
          success: false,
          error: 'Subfolder not found',
          message: `Subfolder "${folderName}" not found in path "${folderPath.join('/')}"`,
          path: path,
          project: projectName,
          foundPath: folderPath.join('/'),
          missingFolder: folderName,
          availableSubfolders: availableSubfolders.map(f => f.name),
          suggestions: [
            'Check if the subfolder name is spelled correctly',
            'Verify the folder exists at this level',
            `Available subfolders in "${folderPath.join('/')}": ${availableSubfolders.map(f => f.name).join(', ') || 'None'}`
          ],
          status: 404
        }, { status: 404 })
      }

      currentParentId = subfolder.id
      folderPath.push(folderName)
      targetFolder = subfolder
    }

    // If the last part is a folder, return folder contents
    if (type === 'folder' || (type === 'auto' && remainingPath.length > 0)) {
      const folderKeys = await prisma.keys.findMany({
        where: {
          folderId: targetFolder.id,
          userId: user.id,
          ...(environment && { environment: environment })
        },
        select: {
          id: true,
          name: true,
          description: true,
          type: true,
          environment: true,
          tags: true,
          isFavorite: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: { updatedAt: 'desc' }
      })

      const folderSubfolders = await prisma.folders.findMany({
        where: {
          userId: user.id,
          parentId: targetFolder.id
        },
        select: {
          id: true,
          name: true,
          description: true,
          color: true,
          createdAt: true
        },
        orderBy: { name: 'asc' }
      })

      return NextResponse.json({
        success: true,
        type: 'folder',
        path: path,
        project: projectName,
        folder: {
          id: targetFolder.id,
          name: targetFolder.name,
          description: targetFolder.description,
          color: targetFolder.color
        },
        environment: environment || 'all',
        totalKeys: folderKeys.length,
        totalSubfolders: folderSubfolders.length,
        keys: folderKeys,
        subfolders: folderSubfolders,
        message: `Successfully accessed folder "${folderPath.join('/')}"`
      })
    }

    // If the last part is a key name, return the key
    if (type === 'key' || (type === 'auto' && remainingPath.length > 0)) {
      const keyName = remainingPath[remainingPath.length - 1]
      const parentFolderId = remainingPath.length > 1 ? targetFolder.id : project.id

      const key = await prisma.keys.findFirst({
        where: {
          name: keyName,
          folderId: parentFolderId,
          userId: user.id,
          ...(environment && { environment: environment })
        },
        select: {
          id: true,
          name: true,
          description: true,
          value: true,
          type: true,
          environment: true,
          tags: true,
          isFavorite: true,
          createdAt: true,
          updatedAt: true
        }
      })

      if (!key) {
        // Get available keys in this folder for better error message
        const availableKeys = await prisma.keys.findMany({
          where: {
            folderId: parentFolderId,
            userId: user.id,
            ...(environment && { environment: environment })
          },
          select: {
            name: true,
            environment: true,
            type: true
          }
        })

        return NextResponse.json({
          success: false,
          error: 'Key not found',
          message: `Key "${keyName}" not found in "${folderPath.join('/')}"`,
          path: path,
          project: projectName,
          folder: folderPath.join('/'),
          keyName: keyName,
          environment: environment || 'all',
          availableKeys: availableKeys.map(k => ({ name: k.name, environment: k.environment, type: k.type })),
          suggestions: [
            'Check if the key name is spelled correctly',
            'Verify the key exists in this folder',
            'Check if the environment filter is correct',
            `Available keys in "${folderPath.join('/')}": ${availableKeys.map(k => k.name).join(', ') || 'None'}`
          ],
          status: 404
        }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        type: 'key',
        path: path,
        project: projectName,
        folder: folderPath.join('/'),
        key: {
          id: key.id,
          name: key.name,
          description: key.description,
          value: key.value,
          type: key.type,
          environment: key.environment,
          tags: key.tags,
          isFavorite: key.isFavorite,
          createdAt: key.createdAt,
          updatedAt: key.updatedAt
        },
        message: `Successfully accessed key "${keyName}" from "${folderPath.join('/')}"`
      })
    }

    // Fallback: return folder contents
    const folderKeys = await prisma.keys.findMany({
      where: {
        folderId: targetFolder.id,
        userId: user.id,
        ...(environment && { environment: environment })
      },
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
        environment: true,
        tags: true,
        isFavorite: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      type: 'folder',
      path: path,
      project: projectName,
      folder: {
        id: targetFolder.id,
        name: targetFolder.name,
        description: targetFolder.description,
        color: targetFolder.color
      },
      environment: environment || 'all',
      totalKeys: folderKeys.length,
      keys: folderKeys,
      message: `Successfully accessed "${folderPath.join('/')}"`
    })

  } catch (error) {
    console.error('Access API error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred while processing your request',
      status: 500,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 