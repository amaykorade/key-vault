#!/usr/bin/env python3

"""
Test script for Key Vault Python SDK
This script tests the SDK functionality with user-provided credentials
"""

import sys
import traceback

def test_key_vault_sdk():
    try:
        # Import the SDK
        print("📦 Importing Key Vault SDK...")
        from key_vault_sdk import KeyVault
        print("✅ SDK imported successfully")
        
        # Configuration - User will provide these values
        API_URL = "https://apivault.it.com/api"
        TOKEN = "tok_cmdflk55p000ajr04lhhqd6wj_b3hol6rgdar"  # Replace with actual token
        FOLDER_ID = "cmdflk67d000gjr04b492q3ha"  # Replace with actual folder ID
        KEY_NAME = "DB_URL"  # Replace with actual key name
        
        print(f"\n🔧 Configuration:")
        print(f"   API URL: {API_URL}")
        print(f"   Token: {TOKEN[:20]}..." if len(TOKEN) > 20 else f"   Token: {TOKEN}")
        print(f"   Folder ID: {FOLDER_ID}")
        print(f"   Key Name: {KEY_NAME}")
        
        # Initialize the SDK
        print(f"\n🚀 Initializing Key Vault client...")
        kv = KeyVault(api_url=API_URL, token=TOKEN)
        print("✅ Key Vault client initialized")
        
        # Test 1: List folders
        print(f"\n📁 Test 1: Listing folders...")
        try:
            folders = kv.list_folders()
            print(f"✅ Found {len(folders)} folders:")
            for folder in folders:
                print(f"   - {folder['name']} (ID: {folder['id']})")
        except Exception as e:
            print(f"❌ Failed to list folders: {e}")
        
        # Test 2: List keys in the specified folder
        print(f"\n🔑 Test 2: Listing keys in folder {FOLDER_ID}...")
        try:
            keys_result = kv.list_keys(folder_id=FOLDER_ID, limit=100)
            print(f"✅ Found {len(keys_result['keys'])} keys in folder:")
            for key in keys_result['keys']:
                print(f"   - {key['name']} (ID: {key['id']})")
        except Exception as e:
            print(f"❌ Failed to list keys: {e}")
        
        # Test 3: Get specific key by name
        print(f"\n🎯 Test 3: Getting key '{KEY_NAME}' from folder {FOLDER_ID}...")
        try:
            secret_value = kv.get_key_by_name(folder_id=FOLDER_ID, key_name=KEY_NAME)
            print(f"✅ Successfully retrieved key value:")
            print(f"   Key: {KEY_NAME}")
            print(f"   Value: {secret_value}")
            print(f"   Value length: {len(secret_value)} characters")
        except Exception as e:
            print(f"❌ Failed to get key by name: {e}")
        
        # Test 4: Get key by ID (if we have a key ID from Test 2)
        print(f"\n🔍 Test 4: Getting key by ID...")
        try:
            if 'keys_result' in locals() and keys_result['keys']:
                first_key = keys_result['keys'][0]
                key_with_value = kv.get_key(key_id=first_key['id'], include_value=True)
                print(f"✅ Successfully retrieved key by ID:")
                print(f"   Key: {key_with_value['name']}")
                print(f"   Value: {key_with_value.get('value', 'No value')}")
            else:
                print("⚠️  No keys found to test get_key by ID")
        except Exception as e:
            print(f"❌ Failed to get key by ID: {e}")
        
        print(f"\n🎉 SDK test completed!")
        
    except ImportError as e:
        print(f"❌ Failed to import SDK: {e}")
        print("Make sure the key_vault_sdk package is installed:")
        print("   pip install key-vault-sdk")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        print("\nFull error details:")
        traceback.print_exc()

if __name__ == "__main__":
    print("🧪 Key Vault Python SDK Test")
    print("=" * 50)
    test_key_vault_sdk() 