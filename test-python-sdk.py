#!/usr/bin/env python3
"""
Test script for the Key Vault Python SDK
"""

import sys
import os

# Add the python-sdk directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'python-sdk'))

from key_vault_sdk import KeyVault, KeyVaultError, KeyVaultAuthError, KeyVaultNotFoundError

def test_python_sdk():
    """Test the Python SDK functionality"""
    
    # Configuration - replace with your actual values
    config = {
        'api_url': 'https://key-vault-psi-eight.vercel.app/api',
        'token': 'your-api-token-here',  # Replace with actual token
        'folder_id': 'your-folder-id-here'  # Replace with actual folder ID
    }
    
    print("🚀 Testing Python SDK...")
    print(f"📡 API URL: {config['api_url']}")
    print(f"🔑 Token: {config['token'][:20]}...")
    print(f"📁 Folder ID: {config['folder_id']}")
    
    try:
        # Initialize the SDK
        kv = KeyVault(
            api_url=config['api_url'],
            token=config['token']
        )
        
        # Test 1: Test connection
        print("\n🔍 Test 1: Testing connection...")
        if kv.test_connection():
            print("✅ Connection successful!")
        else:
            print("❌ Connection failed!")
            return
        
        # Test 2: List folders
        print("\n🔍 Test 2: Listing folders...")
        try:
            folders = kv.list_folders()
            print(f"✅ Found {len(folders)} folders")
            for folder in folders:
                print(f"   - {folder['name']} (ID: {folder['id']})")
        except Exception as e:
            print(f"❌ Failed to list folders: {e}")
        
        # Test 3: List keys in folder
        print(f"\n🔍 Test 3: Listing keys in folder '{config['folder_id']}'...")
        try:
            result = kv.list_keys(folder_id=config['folder_id'], limit=100)
            print(f"✅ Found {len(result['keys'])} keys in folder")
            for key in result['keys']:
                print(f"   - {key['name']} (ID: {key['id']}, Type: {key['type']})")
        except Exception as e:
            print(f"❌ Failed to list keys: {e}")
            return
        
        # Test 4: Get a key by name
        print(f"\n🔍 Test 4: Getting key by name...")
        try:
            # Try to get a test key
            key_value = kv.get_key_by_name(
                folder_id=config['folder_id'],
                key_name="test-key"
            )
            print(f"✅ Successfully retrieved key value: {key_value}")
        except KeyVaultNotFoundError:
            print("⚠️  Test key 'test-key' not found (this is expected if it doesn't exist)")
        except Exception as e:
            print(f"❌ Failed to get key by name: {e}")
        
        # Test 5: Get multiple keys
        print(f"\n🔍 Test 5: Getting multiple keys...")
        try:
            keys = kv.get_multiple_keys(
                folder_id=config['folder_id'],
                key_names=["test-key", "another-key", "third-key"]
            )
            print(f"✅ Retrieved {len(keys)} keys")
            for key_name, value in keys.items():
                status = "✅ Found" if value is not None else "❌ Not found"
                print(f"   - {key_name}: {status}")
        except Exception as e:
            print(f"❌ Failed to get multiple keys: {e}")
        
        print("\n🎉 Python SDK test completed!")
        
    except KeyVaultAuthError as e:
        print(f"❌ Authentication error: {e}")
        print("   Please check your API token")
    except KeyVaultError as e:
        print(f"❌ Key Vault error: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

def simple_usage_example():
    """Show simple usage example"""
    print("\n📖 Simple Usage Example:")
    print("""
from key_vault_sdk import KeyVault

# Initialize
kv = KeyVault(
    api_url="https://yourdomain.com/api",
    token="your-api-token"
)

# Get a key by name
api_key = kv.get_key_by_name("folder-id", "key-name")
print(f"API Key: {api_key}")

# Get multiple keys
keys = kv.get_multiple_keys(
    folder_id="folder-id",
    key_names=["stripe-key", "database-password"]
)
print(f"Retrieved keys: {keys}")
""")

if __name__ == "__main__":
    test_python_sdk()
    simple_usage_example() 