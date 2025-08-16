import { NextResponse } from 'next/server'
import { getCurrentUser } from '../../../lib/auth'
import prisma from '../../../lib/database'
import { decryptKeyValue } from '../../../lib/keyManagement'

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

    // Normalize and validate environment parameter
    let normalizedEnvironment = null
    if (environment) {
      // Convert to uppercase to match the database enum values
      normalizedEnvironment = environment.trim().toUpperCase()
      // Validate environment values (must match the Environment enum in schema)
      const validEnvironments = ['DEVELOPMENT', 'STAGING', 'TESTING', 'PRODUCTION', 'LOCAL', 'OTHER']
      if (!validEnvironments.includes(normalizedEnvironment)) {
        return NextResponse.json({
          success: false,
          error: 'Invalid environment',
          message: `Environment "${environment}" is not valid.`,
          validEnvironments: validEnvironments,
          receivedEnvironment: environment,
          status: 400
        }, { status: 400 })
      }
    }

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

    // Check if this is a key access (has more than 2 path parts)
    const isKeyAccess = pathParts.length > 2
    
    // For key access, environment parameter is mandatory
    if (isKeyAccess && !environment) {
      return NextResponse.json({
        success: false,
        error: 'Environment parameter required for key access',
        message: 'When accessing a specific key, environment parameter is mandatory to prevent ambiguity. Multiple keys with the same name can exist in different environments.',
        examples: [
          '?path=Webmeter/Database/DB_URL&environment=development',
          '?path=MyApp/Production/API_Keys&environment=production',
          '?path=ProjectName/Staging/DB_URL&environment=staging'
        ],
        securityNote: 'This prevents accidentally accessing the wrong environment (e.g., production DB credentials in development)',
        status: 400
      }, { status: 400 })
    }

    console.log('🔍 Access request:', { 
      path, 
      environment, 
      normalizedEnvironment, 
      type, 
      projectName, 
      remainingPath 
    })

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
          ...(normalizedEnvironment && { environment: normalizedEnvironment })
        },
        select: {
          id: true,
          name: true,
          description: true,
          type: true,
          environment: true,
          tags: true,
          isFavorite: true,
          expiresAt: true,
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
        environment: normalizedEnvironment || 'ALL',
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

    // Navigate through all path parts except the last one (which might be a key)
    const folderPathParts = remainingPath.slice(0, -1) // All except last
    const lastPathPart = remainingPath[remainingPath.length - 1] // Last part (might be key or folder)

    // Navigate through folder hierarchy
    for (let i = 0; i < folderPathParts.length; i++) {
      const folderName = folderPathParts[i]
      
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

    // Now determine what the last path part is
    const parentFolderId = targetFolder ? targetFolder.id : project.id
    const parentFolderPath = targetFolder ? folderPath.join('/') : projectName

    // Check if the last part is a key name
    if (type === 'key' || (type === 'auto' && remainingPath.length > 0)) {
      const keyName = lastPathPart
      
      // First check if it's a key in the current folder (environment is mandatory for key access)
      let key = await prisma.keys.findFirst({
        where: {
          name: keyName,
          folderId: parentFolderId,
          userId: user.id,
          environment: normalizedEnvironment // Environment is now mandatory
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

      // If not found, check if it's a subfolder that contains keys
      if (!key && remainingPath.length > 1) {
        const potentialSubfolder = await prisma.folders.findFirst({
          where: {
            name: keyName,
            userId: user.id,
            parentId: parentFolderId
          }
        })

        if (potentialSubfolder) {
          // It's a subfolder, get keys from it
          const subfolderKeys = await prisma.keys.findMany({
            where: {
              folderId: potentialSubfolder.id,
              userId: user.id,
              environment: normalizedEnvironment // Environment is now mandatory
            },
            select: {
              id: true,
              name: true,
              description: true,
              type: true,
              environment: true,
              tags: true,
              isFavorite: true,
              expiresAt: true,
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
              id: potentialSubfolder.id,
              name: potentialSubfolder.name,
              description: potentialSubfolder.description,
              color: potentialSubfolder.color
            },
                      environment: normalizedEnvironment || 'ALL',
          totalKeys: subfolderKeys.length,
          keys: subfolderKeys,
            message: `Successfully accessed folder "${folderPath.join('/')}/${keyName}"`
          })
        }
      }

      if (!key) {
        // Get available keys in this folder for better error message
        const availableKeys = await prisma.keys.findMany({
          where: {
            folderId: parentFolderId,
            userId: user.id,
            environment: normalizedEnvironment // Environment is now mandatory
          },
          select: {
            name: true,
            environment: true,
            type: true
          }
        })

        // Also check available subfolders
        const availableSubfolders = await prisma.folders.findMany({
          where: {
            userId: user.id,
            parentId: parentFolderId
          },
          select: {
            name: true,
            description: true
          }
        })

        return NextResponse.json({
          success: false,
          error: 'Key not found',
          message: `Key "${keyName}" not found in "${parentFolderPath}"`,
          path: path,
          project: projectName,
          folder: parentFolderPath,
          keyName: keyName,
          environment: normalizedEnvironment || 'ALL',
          availableKeys: availableKeys.map(k => ({ name: k.name, environment: k.environment, type: k.type })),
          availableSubfolders: availableSubfolders.map(f => f.name),
          suggestions: [
            'Check if the key name is spelled correctly',
            'Verify the key exists in this folder',
            'Check if the environment filter is correct',
            `Available keys in "${parentFolderPath}": ${availableKeys.map(k => k.name).join(', ') || 'None'}`,
            `Available subfolders in "${parentFolderPath}": ${availableSubfolders.map(f => f.name).join(', ') || 'None'}`
          ],
          status: 404
        }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        type: 'key',
        path: path,
        project: projectName,
        folder: parentFolderPath,
        key: {
          id: key.id,
          name: key.name,
          description: key.description,
          value: await decryptKeyValue(key.value),
          type: key.type,
          environment: key.environment,
          tags: key.tags,
          isFavorite: key.isFavorite,
          createdAt: key.createdAt,
          updatedAt: key.updatedAt
        },
        message: `Successfully accessed key "${keyName}" from "${parentFolderPath}"`
      })
    }

    // If the last part is a folder, return folder contents
    if (type === 'folder' || (type === 'auto' && remainingPath.length > 0)) {
      // Check if the last part is actually a subfolder
      const lastPartSubfolder = await prisma.folders.findFirst({
        where: {
          name: lastPathPart,
          userId: user.id,
          parentId: parentFolderId
        }
      })

      if (lastPartSubfolder) {
        // It's a subfolder, get its contents
        const folderKeys = await prisma.keys.findMany({
          where: {
            folderId: lastPartSubfolder.id,
            userId: user.id,
            ...(normalizedEnvironment && { environment: normalizedEnvironment })
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
            expiresAt: true,
            createdAt: true,
            updatedAt: true
          },
          orderBy: { updatedAt: 'desc' }
        })

        // Decrypt key values
        const decryptedKeys = await Promise.all(
          folderKeys.map(async (key) => ({
            ...key,
            value: await decryptKeyValue(key.value)
          }))
        )

        const folderSubfolders = await prisma.folders.findMany({
          where: {
            userId: user.id,
            parentId: lastPartSubfolder.id
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
            id: lastPartSubfolder.id,
            name: lastPartSubfolder.name,
            description: lastPartSubfolder.description,
            color: lastPartSubfolder.color
          },
                      environment: normalizedEnvironment || 'ALL',
            totalKeys: folderKeys.length,
            totalSubfolders: folderSubfolders.length,
          keys: decryptedKeys,
          subfolders: folderSubfolders,
          message: `Successfully accessed folder "${folderPath.join('/')}/${lastPathPart}"`
        })
      } else {
        // Last part is not a subfolder, check if it's a key
        const potentialKey = await prisma.keys.findFirst({
          where: {
            name: lastPathPart,
            folderId: parentFolderId,
            userId: user.id,
            ...(normalizedEnvironment && { environment: normalizedEnvironment })
          }
        })

        if (potentialKey) {
          // It's a key, return it
          return NextResponse.json({
            success: true,
            type: 'key',
            path: path,
            project: projectName,
            folder: parentFolderPath,
            key: {
              id: potentialKey.id,
              name: potentialKey.name,
              description: potentialKey.description,
              value: potentialKey.value,
              type: potentialKey.type,
              environment: potentialKey.environment,
              tags: potentialKey.tags,
              isFavorite: potentialKey.isFavorite,
              expiresAt: potentialKey.expiresAt,
              createdAt: potentialKey.createdAt,
              updatedAt: potentialKey.updatedAt
            },
            message: `Successfully accessed key "${lastPathPart}" from "${parentFolderPath}"`
          })
        }
      }
    }

    // Fallback: return folder contents from the last valid folder
            const folderKeys = await prisma.keys.findMany({
          where: {
            folderId: parentFolderId,
            userId: user.id,
            ...(normalizedEnvironment && { environment: normalizedEnvironment })
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
            expiresAt: true,
            createdAt: true,
            updatedAt: true
          },
          orderBy: { updatedAt: 'desc' }
        })

        // Decrypt key values
        const decryptedKeys = await Promise.all(
          folderKeys.map(async (key) => ({
            ...key,
            value: await decryptKeyValue(key.value)
          }))
        )

    return NextResponse.json({
      success: true,
      type: 'folder',
      path: path,
      project: projectName,
      folder: targetFolder ? {
        id: targetFolder.id,
        name: targetFolder.name,
        description: targetFolder.description,
        color: targetFolder.color
      } : {
        id: project.id,
        name: project.name,
        description: project.description,
        color: project.color
      },
      environment: normalizedEnvironment || 'ALL',
      totalKeys: folderKeys.length,
              keys: decryptedKeys,
      message: `Successfully accessed "${parentFolderPath}"`
    })

  } catch (error) {
    console.error('Access API error:', error)
    
    // Provide more specific error information
    let errorMessage = 'An unexpected error occurred while processing your request'
    let errorDetails = null
    
    if (error.code === 'P2002') {
      errorMessage = 'Database constraint violation - duplicate entry'
      errorDetails = 'This usually indicates a database schema issue'
    } else if (error.code === 'P2003') {
      errorMessage = 'Database foreign key constraint violation'
      errorDetails = 'Referenced record does not exist'
    } else if (error.code === 'P2014') {
      errorMessage = 'Database connection error'
      errorDetails = 'Unable to connect to database'
    } else if (error.message) {
      errorMessage = error.message
    }
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: errorMessage,
      details: errorDetails,
      status: 500,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 