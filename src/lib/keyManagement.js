import { PrismaClient } from '@prisma/client'
import { encrypt, decrypt } from './encryption.js'
import { logAction } from './audit.js'

const prisma = new PrismaClient()

// Get encryption key from environment
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY

if (!ENCRYPTION_KEY) {
  throw new Error('ENCRYPTION_KEY environment variable is required')
}

export async function createKey(userId, folderId, keyData) {
  const { name, description, value, type, tags, isFavorite } = keyData

  // Validate required fields
  if (!name || !value || !type) {
    throw new Error('Name, value, and type are required')
  }

  // Validate key type
  const validTypes = ['PASSWORD', 'API_KEY', 'SSH_KEY', 'CERTIFICATE', 'SECRET', 'OTHER']
  if (!validTypes.includes(type)) {
    throw new Error('Invalid key type')
  }

  // Encrypt the key value
  const encryptedValue = encrypt(value, ENCRYPTION_KEY)

  try {
    const key = await prisma.key.create({
      data: {
        name,
        description,
        value: encryptedValue,
        type,
        tags: tags || [],
        isFavorite: isFavorite || false,
        userId,
        folderId
      }
    })

    // Create audit log
    await logAction('CREATE', 'key', userId, { 
      resourceId: key.id,
      name, 
      type, 
      folderId 
    })

    return key
  } catch (error) {
    throw new Error(`Failed to create key: ${error.message}`)
  }
}

export async function getKeysByFolder(userId, folderId, limit = 20, offset = 0) {
  try {
    const keys = await prisma.key.findMany({
      where: {
        userId,
        folderId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    })

    const total = await prisma.key.count({
      where: {
        userId,
        folderId
      }
    })

    return { keys, total }
  } catch (error) {
    throw new Error(`Failed to fetch keys: ${error.message}`)
  }
}

export async function getKeyById(userId, keyId) {
  try {
    const key = await prisma.key.findFirst({
      where: {
        id: keyId,
        userId
      }
    })

    if (!key) {
      throw new Error('Key not found')
    }

    return key
  } catch (error) {
    throw new Error(`Failed to fetch key: ${error.message}`)
  }
}

export async function updateKey(userId, keyId, keyData) {
  const { name, description, value, type, tags, isFavorite } = keyData

  try {
    const existingKey = await prisma.key.findFirst({
      where: {
        id: keyId,
        userId
      }
    })

    if (!existingKey) {
      throw new Error('Key not found')
    }

    const updateData = {}
    
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (type !== undefined) updateData.type = type
    if (tags !== undefined) updateData.tags = tags
    if (isFavorite !== undefined) updateData.isFavorite = isFavorite

    // Only encrypt value if it's provided
    if (value !== undefined) {
      updateData.value = encrypt(value, ENCRYPTION_KEY)
    }

    const key = await prisma.key.update({
      where: { id: keyId },
      data: updateData
    })

    // Create audit log
    await logAction('UPDATE', 'key', userId, { 
      resourceId: key.id,
      name: key.name, 
      type: key.type 
    })

    return key
  } catch (error) {
    throw new Error(`Failed to update key: ${error.message}`)
  }
}

export async function deleteKey(userId, keyId) {
  try {
    const key = await prisma.key.findFirst({
      where: {
        id: keyId,
        userId
      }
    })

    if (!key) {
      throw new Error('Key not found')
    }

    await prisma.key.delete({
      where: { id: keyId }
    })

    // Create audit log
    await logAction('DELETE', 'key', userId, { 
      resourceId: keyId,
      name: key.name, 
      type: key.type 
    })

    return { success: true }
  } catch (error) {
    throw new Error(`Failed to delete key: ${error.message}`)
  }
}

export async function decryptKeyValue(encryptedValue) {
  try {
    return decrypt(encryptedValue, ENCRYPTION_KEY)
  } catch (error) {
    throw new Error(`Failed to decrypt key value: ${error.message}`)
  }
}

export function validateKeyData(keyData) {
  const errors = []

  if (!keyData.name || keyData.name.trim().length === 0) {
    errors.push('Key name is required')
  }

  if (!keyData.value || keyData.value.trim().length === 0) {
    errors.push('Key value is required')
  }

  if (!keyData.type) {
    errors.push('Key type is required')
  }

  const validTypes = ['PASSWORD', 'API_KEY', 'SSH_KEY', 'CERTIFICATE', 'SECRET', 'OTHER']
  if (keyData.type && !validTypes.includes(keyData.type)) {
    errors.push('Invalid key type')
  }

  return errors
} 