#!/bin/bash

# Key Vault Production Deployment Script
# This script helps you deploy your Key Vault application to production

set -e  # Exit on any error

echo "🚀 Key Vault Production Deployment Script"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm"
        exit 1
    fi
    
    print_success "Dependencies check passed"
}

# Build the application
build_app() {
    print_status "Building application..."
    
    # Install dependencies
    npm install
    
    # Generate Prisma client
    npx prisma generate
    
    # Build the application
    npm run build
    
    print_success "Application built successfully"
}

# Check environment variables
check_env() {
    print_status "Checking environment variables..."
    
    if [ ! -f ".env.production" ]; then
        print_warning "No .env.production file found"
        print_status "Creating .env.production template..."
        
        cat > .env.production << EOF
# Database Configuration (Production PostgreSQL)
DATABASE_URL="postgresql://username:password@your-production-db-host:5432/key_vault_db"

# Application Configuration
NODE_ENV=production
PORT=3000

# Security Configuration (Generate strong secrets)
JWT_SECRET="your-super-secret-jwt-key-here-minimum-32-chars"
ENCRYPTION_KEY="your-32-character-encryption-key-here"
SESSION_SECRET="your-session-secret-key-here-minimum-32-chars"
SESSION_MAX_AGE=604800000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
ENABLE_AUDIT_LOGGING=true

# Payment Integration (Razorpay - REQUIRED for subscriptions)
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
RAZORPAY_WEBHOOK_SECRET="your-webhook-secret"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id"

# Redis (Optional, for session storage)
REDIS_URL="redis://your-redis-host:6379"
EOF
        
        print_warning "Please update .env.production with your actual values before deploying"
    else
        print_success "Environment file found"
    fi
}

# Deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        print_status "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    # Deploy to production
    vercel --prod
    
    print_success "Deployed to Vercel successfully"
}

# Deploy to Railway
deploy_railway() {
    print_status "Deploying to Railway..."
    
    if ! command -v railway &> /dev/null; then
        print_status "Installing Railway CLI..."
        npm install -g @railway/cli
    fi
    
    # Deploy
    railway up
    
    print_success "Deployed to Railway successfully"
}

# Run database migrations
run_migrations() {
    print_status "Running database migrations..."
    
    npx prisma migrate deploy
    
    print_success "Database migrations completed"
}

# Test the deployment
test_deployment() {
    print_status "Testing deployment..."
    
    # Get the deployment URL (you'll need to update this)
    DEPLOY_URL="https://your-app.vercel.app"
    
    # Test health endpoint
    if curl -f "$DEPLOY_URL/api/stats" > /dev/null 2>&1; then
        print_success "Deployment test passed"
    else
        print_warning "Deployment test failed - please check manually"
    fi
}

# Generate secrets
generate_secrets() {
    print_status "Generating secure secrets..."
    
    echo "JWT_SECRET:"
    openssl rand -base64 32
    
    echo "ENCRYPTION_KEY:"
    openssl rand -hex 16
    
    echo "SESSION_SECRET:"
    openssl rand -base64 32
    
    print_success "Secrets generated - copy these to your .env.production file"
}

# Main deployment function
main() {
    echo "Choose deployment option:"
    echo "1) Deploy to Vercel"
    echo "2) Deploy to Railway"
    echo "3) Generate secure secrets"
    echo "4) Run database migrations"
    echo "5) Test deployment"
    echo "6) Full deployment (Vercel)"
    
    read -p "Enter your choice (1-6): " choice
    
    case $choice in
        1)
            check_dependencies
            build_app
            check_env
            deploy_vercel
            ;;
        2)
            check_dependencies
            build_app
            check_env
            deploy_railway
            ;;
        3)
            generate_secrets
            ;;
        4)
            run_migrations
            ;;
        5)
            test_deployment
            ;;
        6)
            check_dependencies
            build_app
            check_env
            deploy_vercel
            test_deployment
            ;;
        *)
            print_error "Invalid choice"
            exit 1
            ;;
    esac
}

# Run main function
main 