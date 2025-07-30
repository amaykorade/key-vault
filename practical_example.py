#!/usr/bin/env python3

"""
Practical example: Using Key Vault SDK in a real application
This shows how to integrate the SDK into your application code
"""

import os
from key_vault_sdk import KeyVault, KeyVaultError, KeyVaultAuthError, KeyVaultNotFoundError

class DatabaseConfig:
    """Example class that uses Key Vault to get database configuration"""
    
    def __init__(self, api_url, token, folder_id):
        self.kv = KeyVault(api_url=api_url, token=token)
        self.folder_id = folder_id
    
    def get_database_url(self):
        """Get database URL from Key Vault"""
        try:
            return self.kv.get_key_by_name(
                folder_id=self.folder_id, 
                key_name="DB_URL"
            )
        except KeyVaultNotFoundError:
            print("❌ DB_URL key not found in Key Vault")
            return None
        except KeyVaultAuthError:
            print("❌ Authentication failed - check your API token")
            return None
        except KeyVaultError as e:
            print(f"❌ Key Vault error: {e}")
            return None
    
    def get_api_keys(self):
        """Get all API keys from the folder"""
        try:
            result = self.kv.list_keys(folder_id=self.folder_id, limit=100)
            api_keys = {}
            
            for key in result['keys']:
                if key['type'] == 'API_KEY':
                    try:
                        value = self.kv.get_key_by_name(
                            folder_id=self.folder_id, 
                            key_name=key['name']
                        )
                        api_keys[key['name']] = value
                    except Exception as e:
                        print(f"⚠️ Could not get value for {key['name']}: {e}")
            
            return api_keys
        except Exception as e:
            print(f"❌ Error fetching API keys: {e}")
            return {}

def main():
    print("🏗️ Practical Key Vault SDK Example")
    print("=" * 50)
    
    # Configuration
    API_URL = "https://apivault.it.com/api"
    TOKEN = "tok_cmdflk55p000ajr04lhhqd6wj_b3hol6rgdar"
    FOLDER_ID = "cmdflk67d000gjr04b492q3ha"
    
    # Create configuration manager
    config = DatabaseConfig(API_URL, TOKEN, FOLDER_ID)
    
    # Example 1: Get database URL
    print("\n📊 Example 1: Getting Database URL")
    print("-" * 30)
    db_url = config.get_database_url()
    if db_url:
        print(f"✅ Database URL: {db_url}")
        # In a real app, you might use this to connect to your database
        # import psycopg2
        # conn = psycopg2.connect(db_url)
    else:
        print("❌ Failed to get database URL")
    
    # Example 2: Get all API keys
    print("\n🔑 Example 2: Getting All API Keys")
    print("-" * 30)
    api_keys = config.get_api_keys()
    if api_keys:
        print(f"✅ Found {len(api_keys)} API key(s):")
        for name, value in api_keys.items():
            # Mask the value for security
            masked_value = value[:10] + "..." if len(value) > 10 else value
            print(f"   {name}: {masked_value}")
    else:
        print("❌ No API keys found")
    
    # Example 3: Error handling demonstration
    print("\n⚠️ Example 3: Error Handling")
    print("-" * 30)
    try:
        # Try to get a non-existent key
        non_existent = config.kv.get_key_by_name(
            folder_id=FOLDER_ID, 
            key_name="NON_EXISTENT_KEY"
        )
        print(f"✅ Got non-existent key: {non_existent}")
    except KeyVaultNotFoundError:
        print("✅ Correctly handled: Key not found error")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
    
    print(f"\n🎉 Practical example completed!")

if __name__ == "__main__":
    main() 