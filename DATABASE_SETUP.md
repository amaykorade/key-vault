# Database Setup Guide

This guide will help you set up the PostgreSQL database for the Key Vault application.

## Prerequisites

1. **PostgreSQL** installed and running on your system
2. **Node.js** (version 18 or higher)
3. **npm** or **yarn** package manager

## Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file and configure your database:

```bash
cp env.example .env
```

Edit `.env` and update the `DATABASE_URL`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/key_vault_db"
```

Replace `username`, `password`, and `key_vault_db` with your actual PostgreSQL credentials and database name.

### 3. Create Database

Create a new PostgreSQL database:

```sql
CREATE DATABASE key_vault_db;
```

### 4. Run Database Setup

```bash
npm run db:setup
```

This will:
- Test the database connection
- Run all migrations
- Create an admin user
- Create a default folder

### 5. (Optional) Seed with Sample Data

```bash
npm run db:seed
```

This creates sample users, folders, and keys for testing.

## Manual Setup Steps

If you prefer to set up the database manually:

### 1. Generate Prisma Client

```bash
npm run db:generate
```

### 2. Run Migrations

```bash
npm run db:migrate
```

### 3. Create Admin User

Use the setup script or create manually:

```bash
npm run db:setup
```

## Database Schema

The application uses the following main tables:

### Users
- `id`: Unique identifier
- `email`: User email (unique)
- `password`: Hashed password
- `name`: User's display name
- `role`: User role (ADMIN/USER)
- `apiToken`: API token for SDK access (unique)
- `plan`: User subscription plan (FREE/PRO/TEAM)
- `createdAt`/`updatedAt`: Timestamps

### Keys
- `id`: Unique identifier
- `name`: Key name
- `description`: Optional description
- `value`: Encrypted key value
- `type`: Key type (PASSWORD/API_KEY/SSH_KEY/CERTIFICATE/SECRET/OTHER)
- `tags`: Array of tags
- `isFavorite`: Boolean flag
- `userId`: Owner reference
- `folderId`: Optional folder reference

### Folders
- `id`: Unique identifier
- `name`: Folder name
- `description`: Optional description
- `color`: Hex color for UI
- `userId`: Owner reference
- `parentId`: Optional parent folder reference

### Sessions
- `id`: Unique identifier
- `token`: Session token
- `expiresAt`: Expiration timestamp
- `userId`: User reference

### Refresh Tokens
- `id`: Unique identifier
- `token`: Refresh token
- `expiresAt`: Expiration timestamp
- `revoked`: Whether token is revoked
- `userId`: User reference

### Payments
- `id`: Unique identifier
- `userId`: User reference
- `orderId`: Razorpay order ID
- `paymentId`: Razorpay payment ID
- `signature`: Payment signature for verification
- `plan`: Subscription plan (FREE/PRO/TEAM)
- `amount`: Payment amount in smallest currency unit
- `currency`: Payment currency (e.g., "INR")
- `status`: Payment status
- `createdAt`/`updatedAt`: Timestamps

### Audit Logs
- `id`: Unique identifier
- `action`: Action performed (CREATE/READ/UPDATE/DELETE/LOGIN/LOGOUT/EXPORT/IMPORT)
- `resource`: Resource type
- `resourceId`: Optional resource identifier
- `details`: JSON details
- `ipAddress`: Client IP
- `userAgent`: Client user agent
- `userId`: User reference

## Security Features

### Encryption
- All sensitive key values are encrypted using AES-256-GCM
- Each key is encrypted with a master password
- Salt and IV are unique for each encryption

### Authentication
- Passwords are hashed using bcrypt with 12 salt rounds
- Session tokens are cryptographically secure
- Sessions expire after 7 days

### Audit Logging
- All user actions are logged
- Includes IP address and user agent
- Supports compliance and security monitoring

## Development Tools

### Prisma Studio
View and edit your database through a web interface:

```bash
npm run db:studio
```

### Database Scripts

- `npm run db:setup` - Initial database setup
- `npm run db:seed` - Populate with sample data
- `npm run db:migrate` - Run pending migrations
- `npm run db:generate` - Generate Prisma client

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `ENCRYPTION_KEY` | 32-character encryption key | Required |
| `SESSION_SECRET` | Session encryption secret | Required |
| `NODE_ENV` | Environment mode | development |
| `PORT` | Server port | 3000 |
| `RAZORPAY_KEY_ID` | Razorpay public key ID | Optional |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key | Optional |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay webhook secret | Optional |

## Troubleshooting

### Connection Issues
1. Verify PostgreSQL is running
2. Check database credentials in `.env`
3. Ensure database exists
4. Verify network connectivity

### Migration Issues
1. Reset database: `npx prisma migrate reset`
2. Check for conflicting migrations
3. Verify schema syntax

### Permission Issues
1. Ensure database user has proper permissions
2. Check PostgreSQL configuration
3. Verify connection string format

## Production Deployment

### Database Considerations
1. Use a managed PostgreSQL service (AWS RDS, Google Cloud SQL, etc.)
2. Enable connection pooling
3. Set up automated backups
4. Configure monitoring and alerts

### Security Checklist
1. Use strong, unique passwords
2. Enable SSL connections
3. Restrict network access
4. Regular security updates
5. Monitor audit logs
6. Configure payment webhooks securely
7. Validate payment signatures

## Support

For issues related to:
- **Database setup**: Check this guide and Prisma documentation
- **Schema changes**: Use Prisma migrations
- **Performance**: Monitor query performance and add indexes as needed
- **Security**: Review audit logs and encryption implementation 