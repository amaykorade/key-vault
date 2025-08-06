# Hierarchical Folder Structure Guide

## Overview

The Key Vault now supports hierarchical folder structures within projects, allowing you to organize your keys in a more structured way. You can create main project folders and then create subfolders for different types of keys (like Database URLs, Payment keys, API keys, etc.).

## Features

### 1. Project-Based Organization
- Create main project folders (e.g., "E-commerce App", "Mobile App", "Backend Services")
- Each project can contain multiple subfolders for different key categories
- **Free Plan**: 1 project with unlimited subfolders
- **Pro/Team Plans**: Multiple projects with unlimited subfolders

### 2. Hierarchical Folder Structure
- Create subfolders within projects
- Navigate through folder hierarchy with breadcrumb navigation
- Visual folder tree sidebar showing the complete structure
- Unlimited nesting levels for all plans

### 3. Folder-Specific Key Management
- Add keys directly to specific folders
- View keys organized by folder
- Maintain folder-specific statistics

## How to Use

### Creating a Project Structure

1. **Create a Main Project**
   - Go to Dashboard
   - Click "Create Project"
   - Give it a name (e.g., "E-commerce Platform")
   - Choose a color and description

2. **Add Subfolders**
   - Open your project
   - Click "Add Folder" button
   - Create subfolders for different key types:
     - `Database URLs` - For database connection strings
     - `Payment Keys` - For payment gateway API keys
     - `API Keys` - For third-party service APIs
     - `SSH Keys` - For server access
     - `Secrets` - For application secrets

### Example Structure

```
E-commerce Platform (Project)
├── Database URLs
│   ├── Production DB
│   ├── Staging DB
│   └── Development DB
├── Payment Keys
│   ├── Stripe Production
│   ├── Stripe Test
│   └── PayPal Keys
├── API Keys
│   ├── Email Service
│   ├── SMS Gateway
│   └── Analytics
└── SSH Keys
    ├── Production Server
    └── Backup Server
```

### Navigation

- **Folder Tree Sidebar**: Shows the complete project structure
- **Breadcrumb Navigation**: Shows your current location in the folder hierarchy
- **Click to Navigate**: Click on any folder in the tree to navigate to it
- **Current Folder Stats**: Shows keys and subfolder counts for the current folder

### Key Management

- **Add Keys**: Keys are added to the currently selected folder
- **View Keys**: Only shows keys from the current folder
- **Organize**: Move keys between folders as needed

## Benefits

1. **Better Organization**: Group related keys together
2. **Easier Navigation**: Quick access to specific key categories
3. **Scalability**: Handle large numbers of keys efficiently
4. **Team Collaboration**: Clear structure for team members
5. **Security**: Logical separation of different types of sensitive data
6. **Free Plan Friendly**: Even free users can organize keys effectively with unlimited subfolders

## Best Practices

1. **Use Descriptive Names**: Name folders clearly (e.g., "Production Database" vs "DB")
2. **Consistent Structure**: Use similar folder structures across projects
3. **Environment Separation**: Separate production, staging, and development keys
4. **Service-Based Organization**: Group keys by service or functionality
5. **Regular Cleanup**: Remove unused folders and keys

## Plan Limitations

### Free Plan
- **1 Project**: Can create only one main project
- **Unlimited Subfolders**: Can create unlimited subfolders within the project
- **Unlimited Nesting**: Can create nested subfolders at any depth
- **All Features**: Full folder structure functionality within the single project

### Pro Plan
- **3 Projects**: Can create up to 3 main projects
- **Unlimited Subfolders**: Unlimited subfolders in each project
- **All Features**: Complete folder structure functionality

### Team Plan
- **Unlimited Projects**: Can create unlimited projects
- **Unlimited Subfolders**: Unlimited subfolders in each project
- **Team Features**: Shared folder access and team collaboration

## Technical Details

- Folders support unlimited nesting levels
- Each folder can contain both keys and subfolders
- Folder colors help with visual identification
- Breadcrumb navigation shows the complete path
- Folder tree updates automatically when changes are made

## API Endpoints

- `GET /api/folders/tree?projectId={id}` - Get folder tree for a project
- `POST /api/folders` - Create a new folder
- `GET /api/folders/{id}` - Get folder details and keys
- `PUT /api/folders/{id}` - Update folder
- `DELETE /api/folders/{id}` - Delete folder

## Example Usage

```javascript
// Create a subfolder
const response = await fetch('/api/folders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Database URLs',
    description: 'Database connection strings',
    color: '#10B981',
    parentId: 'project-folder-id'
  })
});

// Get folder tree
const treeResponse = await fetch('/api/folders/tree?projectId=project-id');
const treeData = await treeResponse.json();
```

This hierarchical structure makes it much easier to manage and organize your keys as your projects grow in complexity. 