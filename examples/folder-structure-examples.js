/**
 * Key Vault SDK - Hierarchical Folder Structure Examples
 * 
 * This file contains practical examples of how to use the Key Vault SDK
 * with the new hierarchical folder structure feature.
 */

import KeyVault from 'amay-key-vault-sdk';

// Initialize the SDK
const kv = new KeyVault({
  apiUrl: 'https://yourdomain.com/api',
  getToken: () => process.env.KEY_VAULT_TOKEN || 'your-api-token-here'
});

// Example 1: Environment-Based Configuration Management
async function environmentBasedConfig() {
  console.log('🌍 Environment-Based Configuration Management');
  
  try {
    // Get the main project
    const { folders } = await kv.listFolders({ projectId: 'project-123' });
    const project = folders[0];
    
    // Find the Database URLs folder
    const dbFolder = project.children.find(f => f.name === 'Database URLs');
    if (!dbFolder) {
      console.log('Database URLs folder not found');
      return;
    }
    
    // Get database configurations for different environments
    const environments = ['Production', 'Staging', 'Development'];
    const dbConfigs = {};
    
    for (const env of environments) {
      const envFolder = dbFolder.children.find(f => f.name.includes(env));
      if (envFolder) {
        const { keys } = await kv.listKeys({ folderId: envFolder.id });
        
        // Get the actual values
        const config = {};
        for (const key of keys) {
          const keyWithValue = await kv.getKey(key.id, { includeValue: true });
          config[key.name] = keyWithValue.value;
        }
        
        dbConfigs[env] = config;
        console.log(`✅ Loaded ${env} database config:`, Object.keys(config));
      }
    }
    
    // Use the configurations
    console.log('Database configurations loaded:', Object.keys(dbConfigs));
    return dbConfigs;
    
  } catch (error) {
    console.error('❌ Error loading environment configs:', error.message);
  }
}

// Example 2: Service-Based API Key Management
async function serviceBasedAPIKeys() {
  console.log('\n🔑 Service-Based API Key Management');
  
  try {
    const { folders } = await kv.listFolders({ projectId: 'project-123' });
    const project = folders[0];
    
    // Find the API Keys folder
    const apiFolder = project.children.find(f => f.name === 'API Keys');
    if (!apiFolder) {
      console.log('API Keys folder not found');
      return;
    }
    
    // Get all API keys organized by service
    const serviceKeys = {};
    
    for (const serviceFolder of apiFolder.children) {
      const { keys } = await kv.listKeys({ folderId: serviceFolder.id });
      
      const serviceConfig = {};
      for (const key of keys) {
        const keyWithValue = await kv.getKey(key.id, { includeValue: true });
        serviceConfig[key.name] = keyWithValue.value;
      }
      
      serviceKeys[serviceFolder.name] = serviceConfig;
      console.log(`✅ Loaded ${serviceFolder.name} keys:`, Object.keys(serviceConfig));
    }
    
    // Example: Initialize services with their API keys
    const services = {
      email: serviceKeys['Email Service'] || {},
      sms: serviceKeys['SMS Gateway'] || {},
      analytics: serviceKeys['Analytics'] || {}
    };
    
    console.log('Services initialized:', Object.keys(services));
    return services;
    
  } catch (error) {
    console.error('❌ Error loading service API keys:', error.message);
  }
}

// Example 3: Payment Gateway Configuration
async function paymentGatewayConfig() {
  console.log('\n💳 Payment Gateway Configuration');
  
  try {
    const { folders } = await kv.listFolders({ projectId: 'project-123' });
    const project = folders[0];
    
    // Find the Payment Keys folder
    const paymentFolder = project.children.find(f => f.name === 'Payment Keys');
    if (!paymentFolder) {
      console.log('Payment Keys folder not found');
      return;
    }
    
    // Get payment configurations for different environments
    const paymentConfigs = {};
    
    for (const envFolder of paymentFolder.children) {
      const { keys } = await kv.listKeys({ folderId: envFolder.id });
      
      const config = {};
      for (const key of keys) {
        const keyWithValue = await kv.getKey(key.id, { includeValue: true });
        config[key.name] = keyWithValue.value;
      }
      
      paymentConfigs[envFolder.name] = config;
      console.log(`✅ Loaded ${envFolder.name} payment config:`, Object.keys(config));
    }
    
    // Example: Initialize Stripe with production keys
    const stripeConfig = paymentConfigs['Stripe Production'];
    if (stripeConfig) {
      const stripe = {
        secretKey: stripeConfig['STRIPE_SECRET_KEY'],
        publishableKey: stripeConfig['STRIPE_PUBLISHABLE_KEY'],
        webhookSecret: stripeConfig['STRIPE_WEBHOOK_SECRET']
      };
      
      console.log('Stripe production config loaded');
      return stripe;
    }
    
  } catch (error) {
    console.error('❌ Error loading payment config:', error.message);
  }
}

// Example 4: SSH Key Management for Servers
async function sshKeyManagement() {
  console.log('\n🔐 SSH Key Management for Servers');
  
  try {
    const { folders } = await kv.listFolders({ projectId: 'project-123' });
    const project = folders[0];
    
    // Find the SSH Keys folder
    const sshFolder = project.children.find(f => f.name === 'SSH Keys');
    if (!sshFolder) {
      console.log('SSH Keys folder not found');
      return;
    }
    
    // Get SSH keys for different servers
    const serverKeys = {};
    
    for (const serverFolder of sshFolder.children) {
      const { keys } = await kv.listKeys({ folderId: serverFolder.id });
      
      const serverConfig = {};
      for (const key of keys) {
        const keyWithValue = await kv.getKey(key.id, { includeValue: true });
        serverConfig[key.name] = keyWithValue.value;
      }
      
      serverKeys[serverFolder.name] = serverConfig;
      console.log(`✅ Loaded ${serverFolder.name} SSH keys:`, Object.keys(serverConfig));
    }
    
    // Example: Use SSH keys for server connections
    const servers = {
      production: serverKeys['Production Server'] || {},
      backup: serverKeys['Backup Server'] || {}
    };
    
    console.log('SSH keys loaded for servers:', Object.keys(servers));
    return servers;
    
  } catch (error) {
    console.error('❌ Error loading SSH keys:', error.message);
  }
}

// Example 5: Bulk Configuration Loading
async function bulkConfigurationLoading() {
  console.log('\n📦 Bulk Configuration Loading');
  
  try {
    const { folders } = await kv.listFolders({ projectId: 'project-123' });
    const project = folders[0];
    
    // Load all configurations at once
    const allConfigs = {
      database: {},
      api: {},
      payment: {},
      ssh: {}
    };
    
    // Helper function to load keys from a folder
    async function loadKeysFromFolder(folderName) {
      const folder = project.children.find(f => f.name === folderName);
      if (!folder) return {};
      
      const { keys } = await kv.listKeys({ folderId: folder.id, limit: 100 });
      const config = {};
      
      for (const key of keys) {
        const keyWithValue = await kv.getKey(key.id, { includeValue: true });
        config[key.name] = keyWithValue.value;
      }
      
      return config;
    }
    
    // Load all configurations in parallel
    const [dbConfig, apiConfig, paymentConfig, sshConfig] = await Promise.all([
      loadKeysFromFolder('Database URLs'),
      loadKeysFromFolder('API Keys'),
      loadKeysFromFolder('Payment Keys'),
      loadKeysFromFolder('SSH Keys')
    ]);
    
    allConfigs.database = dbConfig;
    allConfigs.api = apiConfig;
    allConfigs.payment = paymentConfig;
    allConfigs.ssh = sshConfig;
    
    console.log('✅ All configurations loaded:');
    console.log('  - Database keys:', Object.keys(dbConfig).length);
    console.log('  - API keys:', Object.keys(apiConfig).length);
    console.log('  - Payment keys:', Object.keys(paymentConfig).length);
    console.log('  - SSH keys:', Object.keys(sshConfig).length);
    
    return allConfigs;
    
  } catch (error) {
    console.error('❌ Error loading bulk configurations:', error.message);
  }
}

// Example 6: Search and Filter Keys
async function searchAndFilterKeys() {
  console.log('\n🔍 Search and Filter Keys');
  
  try {
    // Search for all database-related keys
    const dbResults = await kv.searchKeys({ 
      search: 'database', 
      type: 'PASSWORD' 
    });
    
    console.log(`Found ${dbResults.keys.length} database keys:`, 
      dbResults.keys.map(k => k.name));
    
    // Search for all API keys
    const apiResults = await kv.searchKeys({ 
      type: 'API_KEY' 
    });
    
    console.log(`Found ${apiResults.keys.length} API keys:`, 
      apiResults.keys.map(k => k.name));
    
    // Search for favorite keys
    const favoriteResults = await kv.searchKeys({ 
      favorite: true 
    });
    
    console.log(`Found ${favoriteResults.keys.length} favorite keys:`, 
      favoriteResults.keys.map(k => k.name));
    
    return {
      database: dbResults.keys,
      api: apiResults.keys,
      favorites: favoriteResults.keys
    };
    
  } catch (error) {
    console.error('❌ Error searching keys:', error.message);
  }
}

// Example 7: Folder Navigation Helper
async function folderNavigationHelper() {
  console.log('\n🧭 Folder Navigation Helper');
  
  try {
    const { folders } = await kv.listFolders({ projectId: 'project-123' });
    const project = folders[0];
    
    // Helper function to find a folder by path
    function findFolderByPath(path) {
      let current = project;
      
      for (const folderName of path) {
        const found = current.children?.find(f => f.name === folderName);
        if (!found) {
          throw new Error(`Folder '${folderName}' not found in path: ${path.join(' > ')}`);
        }
        current = found;
      }
      
      return current;
    }
    
    // Example: Navigate to Production Database
    const prodDbFolder = findFolderByPath(['Database URLs', 'Production DB']);
    console.log('✅ Found Production DB folder:', prodDbFolder.name);
    
    // Get keys from the found folder
    const { keys } = await kv.listKeys({ folderId: prodDbFolder.id });
    console.log(`Found ${keys.length} keys in Production DB folder:`, 
      keys.map(k => k.name));
    
    // Example: Navigate to Stripe Production
    const stripeProdFolder = findFolderByPath(['Payment Keys', 'Stripe Production']);
    console.log('✅ Found Stripe Production folder:', stripeProdFolder.name);
    
    return {
      prodDbFolder,
      stripeProdFolder
    };
    
  } catch (error) {
    console.error('❌ Error navigating folders:', error.message);
  }
}

// Example 8: Application Startup Configuration
async function applicationStartupConfig() {
  console.log('\n🚀 Application Startup Configuration');
  
  try {
    // Get project statistics
    const stats = await kv.getStats();
    console.log('Project statistics:', stats);
    
    // Get the main project
    const { folders } = await kv.listFolders({ projectId: 'project-123' });
    const project = folders[0];
    
    // Load essential configurations
    const config = {
      project: {
        name: project.name,
        description: project.description,
        totalKeys: project._count.keys,
        totalFolders: project._count.other_folders
      },
      environments: {},
      services: {}
    };
    
    // Load environment-specific configurations
    const dbFolder = project.children.find(f => f.name === 'Database URLs');
    if (dbFolder) {
      for (const envFolder of dbFolder.children) {
        const { keys } = await kv.listKeys({ folderId: envFolder.id });
        const envConfig = {};
        
        for (const key of keys) {
          const keyWithValue = await kv.getKey(key.id, { includeValue: true });
          envConfig[key.name] = keyWithValue.value;
        }
        
        config.environments[envFolder.name] = envConfig;
      }
    }
    
    // Load service configurations
    const apiFolder = project.children.find(f => f.name === 'API Keys');
    if (apiFolder) {
      for (const serviceFolder of apiFolder.children) {
        const { keys } = await kv.listKeys({ folderId: serviceFolder.id });
        const serviceConfig = {};
        
        for (const key of keys) {
          const keyWithValue = await kv.getKey(key.id, { includeValue: true });
          serviceConfig[key.name] = keyWithValue.value;
        }
        
        config.services[serviceFolder.name] = serviceConfig;
      }
    }
    
    console.log('✅ Application configuration loaded:');
    console.log('  - Project:', config.project.name);
    console.log('  - Environments:', Object.keys(config.environments));
    console.log('  - Services:', Object.keys(config.services));
    
    return config;
    
  } catch (error) {
    console.error('❌ Error loading startup configuration:', error.message);
  }
}

// Run all examples
async function runAllExamples() {
  console.log('🎯 Key Vault SDK - Hierarchical Folder Structure Examples\n');
  
  await environmentBasedConfig();
  await serviceBasedAPIKeys();
  await paymentGatewayConfig();
  await sshKeyManagement();
  await bulkConfigurationLoading();
  await searchAndFilterKeys();
  await folderNavigationHelper();
  await applicationStartupConfig();
  
  console.log('\n✅ All examples completed!');
}

// Export functions for individual use
export {
  environmentBasedConfig,
  serviceBasedAPIKeys,
  paymentGatewayConfig,
  sshKeyManagement,
  bulkConfigurationLoading,
  searchAndFilterKeys,
  folderNavigationHelper,
  applicationStartupConfig,
  runAllExamples
};

// Run examples if this file is executed directly
if (typeof window === 'undefined' && typeof process !== 'undefined') {
  runAllExamples().catch(console.error);
} 