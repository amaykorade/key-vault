import prisma from './database.js'
import { encrypt, decrypt } from './encryption.js'

export async function createKey(userId, keyData, masterPassword) {
  const { name, description, value, type, tags, folderId } = keyData
  
  // Encrypt the key value with master password
  const encryptedValue = encrypt(value, masterPassword)
  
  return await prisma.key.create({
    data: {
      name,
      description,
      value: encryptedValue,
      type,
      tags: tags || [],
      folderId,
      userId
    },
    include: {
      folder: true
    }
  })
}

export async function getKey(keyId, userId, masterPassword) {
  const key = await prisma.key.findFirst({
    where: {
      id: keyId,
      userId
    },
    include: {
      folder: true
    }
  })
  
  if (!key) {
    return null
  }
  
  // Decrypt the key value
  const decryptedValue = decrypt(key.value, masterPassword)
  
  return {
    ...key,
    value: decryptedValue
  }
}

export async function updateKey(keyId, userId, keyData, masterPassword) {
  const { name, description, value, type, tags, folderId } = keyData
  
  // Encrypt the new value if provided
  let encryptedValue = undefined
  if (value !== undefined) {
    encryptedValue = encrypt(value, masterPassword)
  }
  
  return await prisma.key.update({
    where: {
      id: keyId,
      userId
    },
    data: {
      name,
      description,
      value: encryptedValue,
      type,
      tags,
      folderId
    },
    include: {
      folder: true
    }
  })
}

export async function deleteKey(keyId, userId) {
  return await prisma.key.delete({
    where: {
      id: keyId,
      userId
    }
  })
}

export async function getUserKeys(userId, options = {}) {
  const { folderId, type, search, favorite } = options
  
  const where = {
    userId,
    ...(folderId && { folderId }),
    ...(type && { type }),
    ...(favorite !== undefined && { isFavorite: favorite }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } }
      ]
    })
  }
  
  return await prisma.key.findMany({
    where,
    include: {
      folder: true
    },
    orderBy: {
      updatedAt: 'desc'
    }
  })
}

export async function toggleFavorite(keyId, userId) {
  const key = await prisma.key.findFirst({
    where: {
      id: keyId,
      userId
    }
  })
  
  if (!key) {
    throw new Error('Key not found')
  }
  
  return await prisma.key.update({
    where: {
      id: keyId
    },
    data: {
      isFavorite: !key.isFavorite
    }
  })
}

export async function getKeyStats(userId) {
  const [totalKeys, favoriteKeys, keysByType] = await Promise.all([
    prisma.key.count({ where: { userId } }),
    prisma.key.count({ where: { userId, isFavorite: true } }),
    prisma.key.groupBy({
      by: ['type'],
      where: { userId },
      _count: true
    })
  ])
  
  return {
    totalKeys,
    favoriteKeys,
    keysByType: keysByType.reduce((acc, item) => {
      acc[item.type] = item._count
      return acc
    }, {})
  }
} 