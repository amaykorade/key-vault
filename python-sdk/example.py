#!/usr/bin/env python3
"""
Simple example of using the Key Vault Python SDK
"""

from key_vault_sdk import KeyVault

def main():
    # Initialize the SDK
    kv = KeyVault(
        api_url="http://localhost:3000/api",
        token="your-api-token"
    )
    
    # Get a key by name (simplest usage)
    try:
        api_key = kv.get_key_by_name("folder-id", "key-name")
        print(f"API Key: {api_key}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Get multiple keys at once
    try:
        keys = kv.get_multiple_keys(
            folder_id="folder-id",
            key_names=["stripe-key", "database-password", "api-secret"]
        )
        print(f"Retrieved keys: {keys}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main() 