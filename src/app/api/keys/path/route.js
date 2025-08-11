import { NextResponse } from 'next/server'
import { getCurrentUser } from '../../../../lib/auth'
import prisma from '../../../../lib/database'

export async function GET(request) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get path from query parameter
    const { searchParams } = new URL(request.url)
    const path = searchParams.get('path')

    if (!path) {
      return NextResponse.json(
        { error: 'Path parameter is required. Use ?path=ProjectName/Environment' },
        { status: 400 }
      )
    }

    console.log('🔍 Fetching keys by path:', path)

    // Parse the path (e.g., "MyApp/Production" -> ["MyApp", "Production"])
    const pathParts = path.split('/').filter(part => part.trim())
    
    if (pathParts.length === 0) {
      return NextResponse.json(
        { error: 'Invalid path format. Use format: ProjectName/Environment' },
        { status: 400 }
      )
    }

    const projectName = pathParts[0]
    const environment = pathParts[1] || null

    console.log('🔍 Parsed path:', { projectName, environment })

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
          path: path
        },
        { status: 404 }
      )
    }

    let keys = []
    let folder = null

    if (environment) {
      // Find the environment subfolder
      folder = await prisma.folders.findFirst({
        where: {
          name: environment,
          userId: user.id,
          parentId: project.id
        }
      })

      if (!folder) {
        return NextResponse.json(
          { 
            error: 'Environment not found',
            message: `Environment "${environment}" not found in project "${projectName}"`,
            path: path,
            project: projectName
          },
          { status: 404 }
        )
      }

      // Get keys from the environment folder
      keys = await prisma.keys.findMany({
        where: {
          folderId: folder.id,
          userId: user.id
        },
        orderBy: {
          updatedAt: 'desc'
        }
      })

      console.log(`✅ Found ${keys.length} keys in ${projectName}/${environment}`)

    } else {
      // Get all keys from the project (including subfolders)
      const projectKeys = await prisma.keys.findMany({
        where: {
          folderId: project.id,
          userId: user.id
        },
        orderBy: {
          updatedAt: 'desc'
        }
      })

      // Get keys from all subfolders
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
              name: true
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
      folderName: key.folders?.name || projectName
    }))

    return NextResponse.json({
      success: true,
      path: path,
      project: projectName,
      environment: environment,
      folderId: folder?.id || project.id,
      totalKeys: formattedKeys.length,
      keys: formattedKeys
    })

  } catch (error) {
    console.error('Error fetching keys by path:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message 
      },
      { status: 500 }
    )
  }
} 