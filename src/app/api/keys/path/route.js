import { NextResponse } from 'next/server'
import { getCurrentUser } from '../../../../lib/auth'
import prisma from '../../../../lib/database'

export async function GET(request) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { 
          error: 'Unauthorized',
          message: 'Authentication required. Please log in or provide a valid API token.',
          status: 401
        },
        { status: 401 }
      )
    }

    // Get path from query parameter
    const { searchParams } = new URL(request.url)
    const path = searchParams.get('path')

    if (!path) {
      return NextResponse.json(
        { 
          error: 'Missing path parameter',
          message: 'Path parameter is required. Use ?path=ProjectName/Environment/Subfolder',
          example: '?path=MyApp/Production or ?path=MyApp/Development/Database',
          status: 400
        },
        { status: 400 }
      )
    }

    // Validate path format
    if (path.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Invalid path',
          message: 'Path cannot be empty or contain only whitespace',
          status: 400
        },
        { status: 400 }
      )
    }

    console.log('🔍 Fetching keys by path:', path)

    // Parse the path (e.g., "MyApp/Development/Database" -> ["MyApp", "Development", "Database"])
    const pathParts = path.split('/').filter(part => part.trim())
    
    if (pathParts.length === 0) {
      return NextResponse.json(
        { 
          error: 'Invalid path format',
          message: 'Path format is invalid. Use format: ProjectName/Environment/Subfolder',
          example: 'MyApp/Production or MyApp/Development/Database',
          status: 400
        },
        { status: 400 }
      )
    }

    // Check for path length limits
    if (pathParts.length > 10) {
      return NextResponse.json(
        { 
          error: 'Path too deep',
          message: 'Path cannot exceed 10 levels deep for performance reasons',
          currentDepth: pathParts.length,
          maxDepth: 10,
          status: 400
        },
        { status: 400 }
      )
    }

    // Check for invalid characters in path parts
    const invalidChars = /[<>:"|?*]/
    for (let i = 0; i < pathParts.length; i++) {
      if (invalidChars.test(pathParts[i])) {
        return NextResponse.json(
          { 
            error: 'Invalid characters in path',
            message: `Path part "${pathParts[i]}" contains invalid characters`,
            invalidPart: pathParts[i],
            invalidCharacters: ['<', '>', ':', '"', '|', '?', '*'],
            suggestions: [
              'Use only letters, numbers, spaces, hyphens, and underscores',
              'Avoid special characters that are not allowed in folder names'
            ],
            status: 400
          },
          { status: 400 }
        )
      }
    }

    // Check for empty path parts
    for (let i = 0; i < pathParts.length; i++) {
      if (pathParts[i].trim() === '') {
        return NextResponse.json(
          { 
            error: 'Empty path part',
            message: `Path part at position ${i + 1} is empty`,
            path: path,
            emptyPartIndex: i,
            suggestions: [
              'Remove empty parts from the path',
              'Ensure each part of the path has a valid name'
            ],
            status: 400
          },
          { status: 400 }
        )
      }
    }

    const projectName = pathParts[0]
    const remainingPath = pathParts.slice(1) // ["Development", "Database"]

    console.log('🔍 Parsed path:', { projectName, remainingPath })

    // Find the project (root folder) by name
    const project = await prisma.folders.findFirst({
      where: {
        name: projectName,
        userId: user.id,
        parentId: null // Root level project
      }
    })

    if (!project) {
      return NextResponse.json(
        { 
          error: 'Project not found',
          message: `Project "${projectName}" not found or you don't have access to it`,
          suggestions: [
            'Check if the project name is spelled correctly',
            'Verify you have access to this project',
            'Ensure the project exists in your account'
          ],
          path: path,
          project: projectName,
          status: 404
        },
        { status: 404 }
      )
    }

    let keys = []
    let targetFolder = null
    let folderPath = [projectName]

    // Navigate through the folder hierarchy
    if (remainingPath.length > 0) {
      let currentParentId = project.id
      
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
          // Get available subfolders at this level for better error message
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

          return NextResponse.json(
            { 
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
            },
            { status: 404 }
          )
        }

        // Update for next iteration
        currentParentId = subfolder.id
        folderPath.push(folderName)
        targetFolder = subfolder
        
        console.log(`✅ Found subfolder: ${folderName} (ID: ${subfolder.id})`)
      }

      // Get keys from the target subfolder
      keys = await prisma.keys.findMany({
        where: {
          folderId: targetFolder.id,
          userId: user.id
        },
        orderBy: {
          updatedAt: 'desc'
        }
      })

      console.log(`✅ Found ${keys.length} keys in ${folderPath.join('/')}`)

    } else {
      // Get all keys from the project (including all subfolders)
      const projectKeys = await prisma.keys.findMany({
        where: {
          folderId: project.id,
          userId: user.id
        },
        orderBy: {
          updatedAt: 'desc'
        }
      })

      // Get keys from all subfolders recursively
      const subfolderKeys = await prisma.keys.findMany({
        where: {
          folders: {
            userId: user.id,
            parentId: project.id
          }
        },
        include: {
          folders: {
            select: {
              name: true,
              parentId: true
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      })

      keys = [...projectKeys, ...subfolderKeys]
      console.log(`✅ Found ${keys.length} total keys in project ${projectName}`)
    }

    // Format the response
    const formattedKeys = keys.map(key => ({
      id: key.id,
      name: key.name,
      description: key.description,
      value: key.value,
      type: key.type,
      environment: key.environment,
      tags: key.tags,
      isFavorite: key.isFavorite,
      createdAt: key.createdAt,
      updatedAt: key.updatedAt,
      folderName: key.folders?.name || projectName,
      folderPath: key.folders ? `${projectName}/${key.folders.name}` : projectName
    }))

    // Return success response
    return NextResponse.json({
      success: true,
      path: path,
      project: projectName,
      fullPath: folderPath.join('/'),
      targetFolder: targetFolder ? {
        id: targetFolder.id,
        name: targetFolder.name,
        description: targetFolder.description
      } : null,
      totalKeys: formattedKeys.length,
      keys: formattedKeys,
      message: keys.length === 0 ? 
        `No keys found in "${folderPath.join('/')}"` : 
        `Successfully fetched ${keys.length} keys from "${folderPath.join('/')}"`
    })

  } catch (error) {
    console.error('Error fetching keys by path:', error)
    
    // Handle specific Prisma errors
    if (error.code === 'P2025') {
      return NextResponse.json(
        { 
          error: 'Database record not found',
          message: 'The requested folder or key could not be found in the database',
          status: 404
        },
        { status: 404 }
      )
    }
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { 
          error: 'Duplicate entry',
          message: 'A folder with this name already exists at this level',
          status: 409
        },
        { status: 409 }
      )
    }
    
    if (error.code === 'P2003') {
      return NextResponse.json(
        { 
          error: 'Foreign key constraint failed',
          message: 'Invalid folder relationship detected',
          status: 400
        },
        { status: 400 }
      )
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { 
          error: 'Validation error',
          message: error.message,
          status: 400
        },
        { status: 400 }
      )
    }

    // Generic error response
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'An unexpected error occurred while processing your request',
        status: 500,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 