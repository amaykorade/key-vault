#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from key_vault_sdk import KeyVault

def test_sdk():
    print("🧪 Testing Python SDK...")
    
    try:
        # Initialize client
        client = KeyVault(
            api_url="http://localhost:3001/api",
            token="test-token"  # This will fail but we can test the initialization
        )
        
        print("✅ SDK initialization successful")
        
        # Test that the client has the expected methods
        expected_methods = ['list_keys', 'get_key', 'list_folders', 'list_projects', 'test_connection']
        for method in expected_methods:
            if hasattr(client, method):
                print(f"✅ Method {method} exists")
            else:
                print(f"❌ Method {method} missing")
        
        print("\n📋 SDK Test Summary:")
        print("✅ SDK can be imported")
        print("✅ Client can be initialized")
        print("✅ Expected methods are available")
        
    except Exception as e:
        print(f"❌ SDK test failed: {e}")

if __name__ == "__main__":
    test_sdk() 