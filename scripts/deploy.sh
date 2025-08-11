#!/bin/bash

# 🚀 Key Vault Production Deployment Script
# This script automates the deployment process to Vercel

set -e  # Exit on any error

echo "🚀 Starting Key Vault Production Deployment..."

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

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "prisma/schema.prisma" ]; then
    print_error "This script must be run from the Key Vault project root directory!"
    exit 1
fi

# Check git status
print_status "Checking git status..."
if [ -n "$(git status --porcelain)" ]; then
    print_warning "You have uncommitted changes. Please commit or stash them first."
    git status --short
    echo ""
    read -p "Do you want to continue with deployment? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Deployment cancelled. Please commit your changes first."
        exit 1
    fi
fi

# Check if we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    print_warning "You're currently on branch '$CURRENT_BRANCH'. Deploying from main branch is recommended."
    read -p "Do you want to switch to main branch? (Y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Nn]$ ]]; then
        print_warning "Deploying from current branch '$CURRENT_BRANCH'..."
    else
        print_status "Switching to main branch..."
        git checkout main
        git pull origin main
    fi
fi

# Pull latest changes
print_status "Pulling latest changes from remote..."
git pull origin main

# Check for any merge conflicts
if [ -n "$(git status --porcelain)" ]; then
    print_error "Merge conflicts detected! Please resolve them before deploying."
    exit 1
fi

# Build the project locally to catch any build errors
print_status "Building project locally to check for errors..."
if npm run build; then
    print_success "Local build successful!"
else
    print_error "Local build failed! Please fix the errors before deploying."
    exit 1
fi

# Commit any build artifacts if needed
if [ -n "$(git status --porcelain)" ]; then
    print_status "Committing build artifacts..."
    git add .
    git commit -m "Build artifacts for production deployment"
fi

# Push to GitHub
print_status "Pushing to GitHub..."
if git push origin main; then
    print_success "Code pushed to GitHub successfully!"
else
    print_error "Failed to push to GitHub!"
    exit 1
fi

# Deployment summary
echo ""
print_success "🎉 Deployment initiated successfully!"
echo ""
echo "📋 Next steps:"
echo "   1. Vercel will automatically detect the push and start building"
echo "   2. Monitor the build in your Vercel dashboard"
echo "   3. After successful deployment, run database migrations:"
echo "      npx prisma migrate deploy"
echo "   4. Set up test users:"
echo "      node scripts/production-setup.js"
echo ""
echo "🔍 Monitor deployment at:"
echo "   https://vercel.com/dashboard"
echo ""
echo "📚 Full deployment guide:"
echo "   See PRODUCTION_DEPLOYMENT.md for detailed instructions"
echo ""

# Check if Vercel CLI is installed
if command -v vercel &> /dev/null; then
    print_status "Vercel CLI detected. You can also monitor deployment with:"
    echo "   vercel ls"
    echo "   vercel logs"
else
    print_warning "Vercel CLI not installed. Install with: npm i -g vercel"
fi

print_success "Deployment script completed! 🚀" 