import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16
const SALT_LENGTH = 64
const TAG_LENGTH = 16
const KEY_LENGTH = 32
const ITERATIONS = 100000

export function deriveKey(password, salt) {
  return crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, 'sha512')
}

export function encrypt(text, password) {
  const salt = crypto.randomBytes(SALT_LENGTH)
  const iv = crypto.randomBytes(IV_LENGTH)
  const key = deriveKey(password, salt)
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
  cipher.setAAD(Buffer.from('key-vault', 'utf8'))
  
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  const tag = cipher.getAuthTag()
  
  // Combine salt + iv + tag + encrypted data
  const result = salt.toString('hex') + ':' + iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted
  
  return result
}

export function decrypt(encryptedData, password) {
  const parts = encryptedData.split(':')
  if (parts.length !== 4) {
    throw new Error('Invalid encrypted data format')
  }
  
  const salt = Buffer.from(parts[0], 'hex')
  const iv = Buffer.from(parts[1], 'hex')
  const tag = Buffer.from(parts[2], 'hex')
  const encrypted = parts[3]
  
  const key = deriveKey(password, salt)
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  decipher.setAAD(Buffer.from('key-vault', 'utf8'))
  decipher.setAuthTag(tag)
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
}

export function generateSecureKey(length = 32) {
  return crypto.randomBytes(length).toString('hex')
}

export function hashData(data) {
  return crypto.createHash('sha256').update(data).digest('hex')
} 