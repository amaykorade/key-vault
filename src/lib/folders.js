import prisma from './database.js'

export async function createFolder(userId, folderData) {
  const { name, description, color, parentId } = folderData
  
  return await prisma.folders.create({
    data: {
      name,
      description,
      color,
      parentId,
      userId
    },
    include: {
      folders: true,
      other_folders: true,
      _count: {
        select: {
          keys: true,
          other_folders: true
        }
      }
    }
  })
}

export async function getFolder(folderId, userId) {
  return await prisma.folders.findFirst({
    where: {
      id: folderId,
      userId
    },
    include: {
      folders: true,
      other_folders: true,
      keys: {
        orderBy: {
          updatedAt: 'desc'
        }
      },
      _count: {
        select: {
          keys: true,
          other_folders: true
        }
      }
    }
  })
}

export async function updateFolder(folderId, userId, folderData) {
  const { name, description, color, parentId } = folderData
  
  // Prevent circular references
  if (parentId === folderId) {
    throw new Error('Folder cannot be its own parent')
  }
  
  return await prisma.folders.update({
    where: {
      id: folderId,
      userId
    },
    data: {
      name,
      description,
      color,
      parentId
    },
    include: {
      folders: true,
      other_folders: true,
      _count: {
        select: {
          keys: true,
          other_folders: true
        }
      }
    }
  })
}

export async function deleteFolder(folderId, userId) {
  // Get all subfolders recursively
  const subfolderIds = await getSubfolderIds(folderId, userId)
  
  // Move all keys from subfolders to root level
  await prisma.keys.updateMany({
    where: {
      folderId: {
        in: [folderId, ...subfolderIds]
      },
      userId
    },
    data: {
      folderId: null
    }
  })
  
  // Delete all subfolders
  await prisma.folders.deleteMany({
    where: {
      id: {
        in: [folderId, ...subfolderIds]
      },
      userId
    }
  })
}

async function getSubfolderIds(folderId, userId) {
  const subfolders = await prisma.folders.findMany({
    where: {
      parentId: folderId,
      userId
    },
    select: { id: true }
  })
  
  const subfolderIds = subfolders.map(f => f.id)
  
  // Recursively get subfolders of subfolders
  for (const subId of subfolderIds) {
    const nestedIds = await getSubfolderIds(subId, userId)
    subfolderIds.push(...nestedIds)
  }
  
  return subfolderIds
}

export async function getUserFolders(userId) {
  return await prisma.folders.findMany({
    where: {
      userId,
      parentId: null // Only root folders
    },
    include: {
      other_folders: {
        include: {
          _count: {
            select: {
              keys: true,
              other_folders: true
            }
          }
        }
      },
      _count: {
        select: {
          keys: true,
          other_folders: true
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  })
}

export async function getFolderTree(userId) {
  const folders = await prisma.folders.findMany({
    where: { userId },
    include: {
      _count: {
        select: {
          keys: true,
          children: true
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  })
  
  // Build tree structure
  const folderMap = new Map()
  const rootFolders = []
  
  // Create map of all folders
  folders.forEach(folder => {
    folderMap.set(folder.id, {
      ...folder,
      children: []
    })
  })
  
  // Build tree structure
  folders.forEach(folder => {
    if (folder.parentId) {
      const parent = folderMap.get(folder.parentId)
      if (parent) {
        parent.children.push(folderMap.get(folder.id))
      }
    } else {
      rootFolders.push(folderMap.get(folder.id))
    }
  })
  
  return rootFolders
}

export async function moveKeysToFolder(keyIds, folderId, userId) {
  return await prisma.keys.updateMany({
    where: {
      id: {
        in: keyIds
      },
      userId
    },
    data: {
      folderId
    }
  })
} 