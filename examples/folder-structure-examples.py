#!/usr/bin/env python3
"""
Key Vault SDK - Hierarchical Folder Structure Examples (Python)

This file contains practical examples of how to use the Key Vault Python SDK
with the new hierarchical folder structure feature.
"""

import os
from key_vault_sdk import KeyVault, KeyVaultError, KeyVaultAuthError, KeyVaultNotFoundError

# Initialize the SDK
kv = KeyVault(
    api_url="https://yourdomain.com/api",
    token=os.getenv('KEY_VAULT_TOKEN', 'your-api-token-here')
)


def environment_based_config():
    """Example 1: Environment-Based Configuration Management"""
    print("🌍 Environment-Based Configuration Management")
    
    try:
        # Get the main project
        folders = kv.list_folders(project_id="project-123")
        project = folders['folders'][0]
        
        # Find the Database URLs folder
        db_folder = None
        for folder in project['children']:
            if folder['name'] == 'Database URLs':
                db_folder = folder
                break
        
        if not db_folder:
            print("Database URLs folder not found")
            return
        
        # Get database configurations for different environments
        environments = ['Production', 'Staging', 'Development']
        db_configs = {}
        
        for env in environments:
            env_folder = None
            for folder in db_folder['children']:
                if env in folder['name']:
                    env_folder = folder
                    break
            
            if env_folder:
                folder_data = kv.get_folder(folder_id=env_folder['id'])
                keys = folder_data['keys']
                
                # Get the actual values
                config = {}
                for key in keys:
                    key_with_value = kv.get_key(key_id=key['id'], include_value=True)
                    config[key['name']] = key_with_value['value']
                
                db_configs[env] = config
                print(f"✅ Loaded {env} database config: {list(config.keys())}")
        
        # Use the configurations
        print(f"Database configurations loaded: {list(db_configs.keys())}")
        return db_configs
        
    except KeyVaultError as e:
        print(f"❌ Error loading environment configs: {e}")


def service_based_api_keys():
    """Example 2: Service-Based API Key Management"""
    print("\n🔑 Service-Based API Key Management")
    
    try:
        folders = kv.list_folders(project_id="project-123")
        project = folders['folders'][0]
        
        # Find the API Keys folder
        api_folder = None
        for folder in project['children']:
            if folder['name'] == 'API Keys':
                api_folder = folder
                break
        
        if not api_folder:
            print("API Keys folder not found")
            return
        
        # Get all API keys organized by service
        service_keys = {}
        
        for service_folder in api_folder['children']:
            folder_data = kv.get_folder(folder_id=service_folder['id'])
            keys = folder_data['keys']
            
            service_config = {}
            for key in keys:
                key_with_value = kv.get_key(key_id=key['id'], include_value=True)
                service_config[key['name']] = key_with_value['value']
            
            service_keys[service_folder['name']] = service_config
            print(f"✅ Loaded {service_folder['name']} keys: {list(service_config.keys())}")
        
        # Example: Initialize services with their API keys
        services = {
            'email': service_keys.get('Email Service', {}),
            'sms': service_keys.get('SMS Gateway', {}),
            'analytics': service_keys.get('Analytics', {})
        }
        
        print(f"Services initialized: {list(services.keys())}")
        return services
        
    except KeyVaultError as e:
        print(f"❌ Error loading service API keys: {e}")


def payment_gateway_config():
    """Example 3: Payment Gateway Configuration"""
    print("\n💳 Payment Gateway Configuration")
    
    try:
        folders = kv.list_folders(project_id="project-123")
        project = folders['folders'][0]
        
        # Find the Payment Keys folder
        payment_folder = None
        for folder in project['children']:
            if folder['name'] == 'Payment Keys':
                payment_folder = folder
                break
        
        if not payment_folder:
            print("Payment Keys folder not found")
            return
        
        # Get payment configurations for different environments
        payment_configs = {}
        
        for env_folder in payment_folder['children']:
            folder_data = kv.get_folder(folder_id=env_folder['id'])
            keys = folder_data['keys']
            
            config = {}
            for key in keys:
                key_with_value = kv.get_key(key_id=key['id'], include_value=True)
                config[key['name']] = key_with_value['value']
            
            payment_configs[env_folder['name']] = config
            print(f"✅ Loaded {env_folder['name']} payment config: {list(config.keys())}")
        
        # Example: Initialize Stripe with production keys
        stripe_config = payment_configs.get('Stripe Production')
        if stripe_config:
            stripe = {
                'secret_key': stripe_config.get('STRIPE_SECRET_KEY'),
                'publishable_key': stripe_config.get('STRIPE_PUBLISHABLE_KEY'),
                'webhook_secret': stripe_config.get('STRIPE_WEBHOOK_SECRET')
            }
            
            print("Stripe production config loaded")
            return stripe
        
    except KeyVaultError as e:
        print(f"❌ Error loading payment config: {e}")


def ssh_key_management():
    """Example 4: SSH Key Management for Servers"""
    print("\n🔐 SSH Key Management for Servers")
    
    try:
        folders = kv.list_folders(project_id="project-123")
        project = folders['folders'][0]
        
        # Find the SSH Keys folder
        ssh_folder = None
        for folder in project['children']:
            if folder['name'] == 'SSH Keys':
                ssh_folder = folder
                break
        
        if not ssh_folder:
            print("SSH Keys folder not found")
            return
        
        # Get SSH keys for different servers
        server_keys = {}
        
        for server_folder in ssh_folder['children']:
            folder_data = kv.get_folder(folder_id=server_folder['id'])
            keys = folder_data['keys']
            
            server_config = {}
            for key in keys:
                key_with_value = kv.get_key(key_id=key['id'], include_value=True)
                server_config[key['name']] = key_with_value['value']
            
            server_keys[server_folder['name']] = server_config
            print(f"✅ Loaded {server_folder['name']} SSH keys: {list(server_config.keys())}")
        
        # Example: Use SSH keys for server connections
        servers = {
            'production': server_keys.get('Production Server', {}),
            'backup': server_keys.get('Backup Server', {})
        }
        
        print(f"SSH keys loaded for servers: {list(servers.keys())}")
        return servers
        
    except KeyVaultError as e:
        print(f"❌ Error loading SSH keys: {e}")


def bulk_configuration_loading():
    """Example 5: Bulk Configuration Loading"""
    print("\n📦 Bulk Configuration Loading")
    
    try:
        folders = kv.list_folders(project_id="project-123")
        project = folders['folders'][0]
        
        # Load all configurations at once
        all_configs = {
            'database': {},
            'api': {},
            'payment': {},
            'ssh': {}
        }
        
        # Helper function to load keys from a folder
        def load_keys_from_folder(folder_name):
            folder = None
            for f in project['children']:
                if f['name'] == folder_name:
                    folder = f
                    break
            
            if not folder:
                return {}
            
            folder_data = kv.get_folder(folder_id=folder['id'])
            keys = folder_data['keys']
            config = {}
            
            for key in keys:
                key_with_value = kv.get_key(key_id=key['id'], include_value=True)
                config[key['name']] = key_with_value['value']
            
            return config
        
        # Load all configurations
        db_config = load_keys_from_folder('Database URLs')
        api_config = load_keys_from_folder('API Keys')
        payment_config = load_keys_from_folder('Payment Keys')
        ssh_config = load_keys_from_folder('SSH Keys')
        
        all_configs['database'] = db_config
        all_configs['api'] = api_config
        all_configs['payment'] = payment_config
        all_configs['ssh'] = ssh_config
        
        print("✅ All configurations loaded:")
        print(f"  - Database keys: {len(db_config)}")
        print(f"  - API keys: {len(api_config)}")
        print(f"  - Payment keys: {len(payment_config)}")
        print(f"  - SSH keys: {len(ssh_config)}")
        
        return all_configs
        
    except KeyVaultError as e:
        print(f"❌ Error loading bulk configurations: {e}")


def search_and_filter_keys():
    """Example 6: Search and Filter Keys"""
    print("\n🔍 Search and Filter Keys")
    
    try:
        # Search for all database-related keys
        db_results = kv.search_keys(search="database", key_type="PASSWORD")
        
        print(f"Found {len(db_results['keys'])} database keys: {[k['name'] for k in db_results['keys']]}")
        
        # Search for all API keys
        api_results = kv.search_keys(key_type="API_KEY")
        
        print(f"Found {len(api_results['keys'])} API keys: {[k['name'] for k in api_results['keys']]}")
        
        # Search for favorite keys
        favorite_results = kv.search_keys(favorite=True)
        
        print(f"Found {len(favorite_results['keys'])} favorite keys: {[k['name'] for k in favorite_results['keys']]}")
        
        return {
            'database': db_results['keys'],
            'api': api_results['keys'],
            'favorites': favorite_results['keys']
        }
        
    except KeyVaultError as e:
        print(f"❌ Error searching keys: {e}")


def folder_navigation_helper():
    """Example 7: Folder Navigation Helper"""
    print("\n🧭 Folder Navigation Helper")
    
    try:
        folders = kv.list_folders(project_id="project-123")
        project = folders['folders'][0]
        
        # Use the navigate_folder_tree helper
        tree = kv.navigate_folder_tree(project_id="project-123")
        
        # Find folders by name
        db_folder = tree['find_folder_by_name']('Database URLs')
        if db_folder:
            print(f"✅ Found Database URLs folder: {db_folder['name']}")
        
        prod_db_folder = tree['find_folder_by_name']('Production DB')
        if prod_db_folder:
            print(f"✅ Found Production DB folder: {prod_db_folder['name']}")
            
            # Get keys from the found folder
            folder_data = kv.get_folder(folder_id=prod_db_folder['id'])
            keys = folder_data['keys']
            print(f"Found {len(keys)} keys in Production DB folder: {[k['name'] for k in keys]}")
        
        stripe_prod_folder = tree['find_folder_by_name']('Stripe Production')
        if stripe_prod_folder:
            print(f"✅ Found Stripe Production folder: {stripe_prod_folder['name']}")
        
        return {
            'db_folder': db_folder,
            'prod_db_folder': prod_db_folder,
            'stripe_prod_folder': stripe_prod_folder
        }
        
    except KeyVaultError as e:
        print(f"❌ Error navigating folders: {e}")


def application_startup_config():
    """Example 8: Application Startup Configuration"""
    print("\n🚀 Application Startup Configuration")
    
    try:
        # Get project statistics
        stats = kv.get_stats()
        print(f"Project statistics: {stats}")
        
        # Get the main project
        folders = kv.list_folders(project_id="project-123")
        project = folders['folders'][0]
        
        # Load essential configurations
        config = {
            'project': {
                'name': project['name'],
                'description': project['description'],
                'total_keys': project['_count']['keys'],
                'total_folders': project['_count']['other_folders']
            },
            'environments': {},
            'services': {}
        }
        
        # Load environment-specific configurations
        db_folder = None
        for folder in project['children']:
            if folder['name'] == 'Database URLs':
                db_folder = folder
                break
        
        if db_folder:
            for env_folder in db_folder['children']:
                folder_data = kv.get_folder(folder_id=env_folder['id'])
                keys = folder_data['keys']
                env_config = {}
                
                for key in keys:
                    key_with_value = kv.get_key(key_id=key['id'], include_value=True)
                    env_config[key['name']] = key_with_value['value']
                
                config['environments'][env_folder['name']] = env_config
        
        # Load service configurations
        api_folder = None
        for folder in project['children']:
            if folder['name'] == 'API Keys':
                api_folder = folder
                break
        
        if api_folder:
            for service_folder in api_folder['children']:
                folder_data = kv.get_folder(folder_id=service_folder['id'])
                keys = folder_data['keys']
                service_config = {}
                
                for key in keys:
                    key_with_value = kv.get_key(key_id=key['id'], include_value=True)
                    service_config[key['name']] = key_with_value['value']
                
                config['services'][service_folder['name']] = service_config
        
        print("✅ Application configuration loaded:")
        print(f"  - Project: {config['project']['name']}")
        print(f"  - Environments: {list(config['environments'].keys())}")
        print(f"  - Services: {list(config['services'].keys())}")
        
        return config
        
    except KeyVaultError as e:
        print(f"❌ Error loading startup configuration: {e}")


def print_folder_tree():
    """Example 9: Print Folder Tree Structure"""
    print("\n🌳 Print Folder Tree Structure")
    
    try:
        folders = kv.list_folders(project_id="project-123")
        
        def print_tree(folder_list, level=0):
            for folder in folder_list:
                indent = "  " * level
                icon = "📁" if folder.get('children') else "📂"
                print(f"{indent}{icon} {folder['name']} ({folder['_count']['keys']} keys)")
                
                if folder.get('children'):
                    print_tree(folder['children'], level + 1)
        
        print_tree(folders['folders'])
        
    except KeyVaultError as e:
        print(f"❌ Error printing folder tree: {e}")


def run_all_examples():
    """Run all examples"""
    print("🎯 Key Vault SDK - Hierarchical Folder Structure Examples (Python)\n")
    
    environment_based_config()
    service_based_api_keys()
    payment_gateway_config()
    ssh_key_management()
    bulk_configuration_loading()
    search_and_filter_keys()
    folder_navigation_helper()
    application_startup_config()
    print_folder_tree()
    
    print("\n✅ All examples completed!")


if __name__ == "__main__":
    run_all_examples() 