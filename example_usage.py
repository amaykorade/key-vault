#!/usr/bin/env python3

"""
Example usage of the Key Vault Python SDK
This demonstrates how to use the published amay-key-vault-sdk package
"""

from key_vault_sdk import KeyVault

def main():
    print("🔑 Key Vault Python SDK Example")
    print("=" * 50)
    
    # Configuration - Replace with your actual values
    API_URL = "https://apivault.it.com/api"
    TOKEN = "tok_cmdflk55p000ajr04lhhqd6wj_b3hol6rgdar"  # Your API token
    FOLDER_ID = "cmdflk67d000gjr04b492q3ha"  # Your folder ID
    KEY_NAME = "DB_URL"  # The key you want to fetch
    
    try:
        # Step 1: Initialize the SDK
        print("📦 Initializing Key Vault SDK...")
        kv = KeyVault(api_url=API_URL, token=TOKEN)
        print("✅ SDK initialized successfully")
        
        # Step 2: List all folders
        print("\n📁 Listing all folders...")
        folders = kv.list_folders()
        print(f"Found {len(folders)} folder(s):")
        for folder in folders:
            print(f"  - {folder['name']} (ID: {folder['id']})")
        
        # Step 3: List keys in the specified folder
        print(f"\n🔑 Listing keys in folder '{FOLDER_ID}'...")
        keys_result = kv.list_keys(folder_id=FOLDER_ID, limit=100)
        print(f"Found {len(keys_result['keys'])} key(s):")
        for key in keys_result['keys']:
            print(f"  - {key['name']} (ID: {key['id']})")
        
        # Step 4: Fetch a specific key by name
        print(f"\n🎯 Fetching key '{KEY_NAME}'...")
        secret_value = kv.get_key_by_name(folder_id=FOLDER_ID, key_name=KEY_NAME)
        print(f"✅ Successfully retrieved '{KEY_NAME}':")
        print(f"   Value: {secret_value}")
        print(f"   Length: {len(secret_value)} characters")
        
        # Step 5: Fetch a key by ID (using the first key from the list)
        if keys_result['keys']:
            first_key = keys_result['keys'][0]
            print(f"\n🔍 Fetching key by ID '{first_key['id']}'...")
            key_details = kv.get_key(key_id=first_key['id'], include_value=True)
            print(f"✅ Key details:")
            print(f"   Name: {key_details['name']}")
            print(f"   Type: {key_details['type']}")
            print(f"   Value: {key_details.get('value', 'No value')}")
        
        print(f"\n🎉 Example completed successfully!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\nMake sure to:")
        print("1. Replace the configuration values with your actual data")
        print("2. Check that your API token is valid")
        print("3. Verify the folder ID and key name exist")

if __name__ == "__main__":
    main() 