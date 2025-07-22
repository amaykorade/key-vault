# Key Vault - Secure Secret Management

A modern, secure secret management application built with Next.js, featuring encrypted storage, API access, and subscription-based plans.

## Features

### 🔐 Security
- **AES-256-GCM Encryption**: All secrets are encrypted at rest
- **Secure Authentication**: JWT-based sessions with bcrypt password hashing
- **API Token Access**: Generate tokens for programmatic access
- **Audit Logging**: Complete audit trail of all actions

### 📁 Organization
- **Project-based Organization**: Group secrets by projects/folders
- **Tags & Favorites**: Organize and mark important secrets
- **Search & Filter**: Find secrets quickly with advanced filtering

### 🚀 Developer Experience
- **JavaScript SDK**: Easy integration with your applications
- **RESTful API**: Full API access for automation
- **Multiple Key Types**: Passwords, API keys, SSH keys, certificates, and more

### 💳 Subscription Plans
- **Free Plan**: 1 project, 5 secrets, basic features
- **Pro Plan ($9/month)**: 3 projects, 100 secrets, audit logs, expiring secrets
- **Team Plan ($29/month)**: Unlimited projects, 1000+ secrets, team features

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd key-vault
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/key_vault_db"
   JWT_SECRET="your-super-secret-jwt-key-here"
   ENCRYPTION_KEY="your-32-character-encryption-key"
   SESSION_SECRET="your-session-secret-key-here"
   
   # For payments (optional)
   RAZORPAY_KEY_ID="your-razorpay-key-id"
   RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
   RAZORPAY_WEBHOOK_SECRET="your-webhook-secret"
   ```

4. **Set up the database**
   ```bash
   npm run db:setup
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## SDK Usage

### Installation
```bash
npm install key-vault-sdk
```

### Basic Usage
```javascript
import KeyVault from 'key-vault-sdk';

const kv = new KeyVault({
  apiUrl: 'https://yourdomain.com/api',
  getToken: async () => 'your-api-token'
});

// Get a specific key's value
const secretValue = await kv.getKeyValue('your-folder-id', 'key-name');
console.log('Secret retrieved successfully');
```

### Advanced Usage
```javascript
// List all keys in a folder
const { keys } = await kv.listKeys({ folderId: 'your-folder-id' });

// Get a specific key with metadata
const key = await kv.getKey('key-id', { includeValue: true });
```

## API Documentation

### Authentication
All API requests require authentication via:
- **Session Cookie**: For web application
- **Bearer Token**: For API access (`Authorization: Bearer <token>`)

### Key Endpoints

#### Create a Key
```http
POST /api/keys
Content-Type: application/json

{
  "name": "Database Password",
  "value": "secret-password",
  "type": "PASSWORD",
  "folderId": "folder-id",
  "description": "Production database password"
}
```

#### List Keys
```http
GET /api/keys?folderId=folder-id
```

#### Get Key Value
```http
GET /api/keys/{keyId}?includeValue=true
```

#### Update Key
```http
PUT /api/keys/{keyId}
Content-Type: application/json

{
  "name": "Updated Name",
  "value": "new-secret-value"
}
```

#### Delete Key
```http
DELETE /api/keys/{keyId}
```

### Folder Endpoints

#### Create Folder
```http
POST /api/folders
Content-Type: application/json

{
  "name": "Production",
  "description": "Production environment secrets",
  "color": "#ff0000"
}
```

#### List Folders
```http
GET /api/folders
```

## Payment Integration

The application integrates with Razorpay for subscription management:

### Webhook Setup
1. Configure webhook URL in Razorpay dashboard: `https://yourdomain.com/api/payment/webhook`
2. Select events: `payment.captured` and `order.paid`
3. Set webhook secret in environment variables

### Plan Limits
- **Free**: 1 project, 5 secrets
- **Pro**: 3 projects, 100 secrets  
- **Team**: Unlimited projects, 1000+ secrets

## Development

### Database Commands
```bash
npm run db:setup    # Initial setup
npm run db:seed     # Add sample data
npm run db:migrate  # Run migrations
npm run db:studio   # Open Prisma Studio
```

### Available Scripts
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
```

## Security Considerations

### Encryption
- All secret values are encrypted using AES-256-GCM
- Each encryption uses a unique salt and IV
- Master encryption key is stored securely

### Authentication
- Passwords hashed with bcrypt (12 rounds)
- JWT tokens with configurable expiration
- API tokens for programmatic access

### Access Control
- Users can only access their own secrets
- Admin users have additional privileges
- Audit logging for compliance

## Deployment

### Environment Variables
See `env.example` for all required environment variables.

### Production Checklist
- [ ] Set strong, unique secrets
- [ ] Configure SSL/TLS
- [ ] Set up database backups
- [ ] Configure monitoring
- [ ] Set up webhook endpoints
- [ ] Test payment integration

## Support

- **Documentation**: Check the `/docs` page in the application
- **API Reference**: Available at `/api` page
- **Issues**: Report bugs and feature requests via GitHub

## License

MIT License - see LICENSE file for details.
