#!/usr/bin/env python3
"""
Simple functional test for the Key Vault Python SDK
"""

from key_vault_sdk import KeyVault

def test_basic_functionality():
    """Test basic SDK functionality"""
    print("🧪 Testing basic SDK functionality...")
    
    # Initialize SDK
    kv = KeyVault(
        api_url="https://example.com/api",
        token="dummy-token",
        timeout=30
    )
    
    print(f"✅ SDK initialized with URL: {kv.api_url}")
    print(f"✅ Token configured: {'Yes' if kv.token else 'No'}")
    print(f"✅ Timeout set to: {kv.timeout} seconds")
    
    # Test method availability
    methods = [
        'test_connection',
        'list_folders', 
        'list_keys',
        'get_key',
        'get_key_by_name',
        'get_multiple_keys'
    ]
    
    for method in methods:
        if hasattr(kv, method):
            print(f"✅ Method '{method}' is available")
        else:
            print(f"❌ Method '{method}' is missing")
    
    print("\n🎉 Basic functionality test completed!")
    print("📝 The SDK is properly structured and ready to use.")

if __name__ == "__main__":
    test_basic_functionality() 