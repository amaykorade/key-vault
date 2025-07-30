#!/usr/bin/env python3

"""
Environment-based Key Vault SDK Example
Shows best practices for using environment variables with the SDK
"""

import os
from key_vault_sdk import KeyVault

def main():
    print("🌍 Environment-based Key Vault SDK Example")
    print("=" * 50)
    
    # Get configuration from environment variables
    API_URL = os.getenv('KEY_VAULT_API_URL', 'https://apivault.it.com/api')
    TOKEN = os.getenv('KEY_VAULT_TOKEN', 'tok_cmdflk55p000ajr04lhhqd6wj_b3hol6rgdar')
    FOLDER_ID = os.getenv('KEY_VAULT_FOLDER_ID', 'cmdflk67d000gjr04b492q3ha')
    KEY_NAME = os.getenv('KEY_VAULT_KEY_NAME', 'DB_URL')
    
    print(f"🔧 Configuration from environment:")
    print(f"   API URL: {API_URL}")
    print(f"   Token: {TOKEN[:20]}..." if len(TOKEN) > 20 else f"   Token: {TOKEN}")
    print(f"   Folder ID: {FOLDER_ID}")
    print(f"   Key Name: {KEY_NAME}")
    
    try:
        # Initialize SDK
        kv = KeyVault(api_url=API_URL, token=TOKEN)
        
        # Fetch the specified key
        print(f"\n🎯 Fetching '{KEY_NAME}' from Key Vault...")
        secret_value = kv.get_key_by_name(folder_id=FOLDER_ID, key_name=KEY_NAME)
        
        print(f"✅ Successfully retrieved secret!")
        print(f"   Key: {KEY_NAME}")
        print(f"   Value: {secret_value}")
        
        # Example: Use the secret in your application
        print(f"\n💡 Example usage in your app:")
        print(f"   # You can now use '{secret_value}' in your application")
        print(f"   # For example, connect to a database:")
        print(f"   # import psycopg2")
        print(f"   # conn = psycopg2.connect('{secret_value}')")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print(f"\n💡 To set environment variables, use:")
        print(f"   export KEY_VAULT_API_URL='{API_URL}'")
        print(f"   export KEY_VAULT_TOKEN='your-token-here'")
        print(f"   export KEY_VAULT_FOLDER_ID='your-folder-id'")
        print(f"   export KEY_VAULT_KEY_NAME='your-key-name'")

if __name__ == "__main__":
    main() 