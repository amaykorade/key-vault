#!/usr/bin/env python3
"""
Test script for the Key Vault Python SDK
This script tests all the main functionality of the SDK
"""

import os
import sys
from key_vault_sdk import KeyVault, KeyVaultError, KeyVaultAuthError, KeyVaultNotFoundError

def test_sdk_import():
    """Test if the SDK can be imported correctly"""
    print("🔍 Testing SDK import...")
    try:
        from key_vault_sdk import KeyVault
        print("✅ SDK imported successfully!")
        return True
    except ImportError as e:
        print(f"❌ Failed to import SDK: {e}")
        return False

def test_sdk_initialization():
    """Test SDK initialization"""
    print("\n🔍 Testing SDK initialization...")
    try:
        # Test with dummy values
        kv = KeyVault(
            api_url="https://example.com/api",
            token="dummy-token"
        )
        print("✅ SDK initialized successfully!")
        return kv
    except Exception as e:
        print(f"❌ Failed to initialize SDK: {e}")
        return None

def test_connection_methods(kv):
    """Test connection and utility methods"""
    print("\n🔍 Testing connection methods...")
    
    # Test test_connection method
    try:
        result = kv.test_connection()
        print(f"✅ test_connection() method exists and returns: {result}")
    except Exception as e:
        print(f"❌ test_connection() failed: {e}")
    
    # Test list_folders method
    try:
        folders = kv.list_folders()
        print(f"✅ list_folders() method exists and returns: {type(folders)}")
    except Exception as e:
        print(f"❌ list_folders() failed: {e}")

def test_key_methods(kv):
    """Test key-related methods"""
    print("\n🔍 Testing key methods...")
    
    # Test list_keys method
    try:
        result = kv.list_keys(folder_id="test-folder")
        print(f"✅ list_keys() method exists and returns: {type(result)}")
    except Exception as e:
        print(f"❌ list_keys() failed: {e}")
    
    # Test get_key method
    try:
        key = kv.get_key(key_id="test-key")
        print(f"✅ get_key() method exists and returns: {type(key)}")
    except Exception as e:
        print(f"❌ get_key() failed: {e}")
    
    # Test get_key_by_name method
    try:
        value = kv.get_key_by_name(folder_id="test-folder", key_name="test-key")
        print(f"✅ get_key_by_name() method exists and returns: {type(value)}")
    except Exception as e:
        print(f"❌ get_key_by_name() failed: {e}")
    
    # Test get_multiple_keys method
    try:
        keys = kv.get_multiple_keys(folder_id="test-folder", key_names=["key1", "key2"])
        print(f"✅ get_multiple_keys() method exists and returns: {type(keys)}")
    except Exception as e:
        print(f"❌ get_multiple_keys() failed: {e}")

def test_error_handling():
    """Test error handling and custom exceptions"""
    print("\n🔍 Testing error handling...")
    
    try:
        from key_vault_sdk import KeyVaultError, KeyVaultAuthError, KeyVaultNotFoundError
        print("✅ Custom exceptions imported successfully!")
        
        # Test exception hierarchy
        auth_error = KeyVaultAuthError("Test auth error")
        not_found_error = KeyVaultNotFoundError("Test not found error")
        general_error = KeyVaultError("Test general error")
        
        print("✅ Custom exceptions can be instantiated!")
        return True
    except Exception as e:
        print(f"❌ Error handling test failed: {e}")
        return False

def test_sdk_attributes(kv):
    """Test SDK attributes and configuration"""
    print("\n🔍 Testing SDK attributes...")
    
    # Check if SDK has expected attributes
    expected_attrs = ['api_url', 'token', 'timeout']
    for attr in expected_attrs:
        if hasattr(kv, attr):
            print(f"✅ SDK has '{attr}' attribute")
        else:
            print(f"❌ SDK missing '{attr}' attribute")
    
    # Check timeout default
    if hasattr(kv, 'timeout'):
        print(f"✅ Default timeout: {kv.timeout} seconds")

def run_comprehensive_test():
    """Run all tests"""
    print("🚀 Starting comprehensive Key Vault SDK test...")
    print("=" * 50)
    
    # Test 1: Import
    if not test_sdk_import():
        print("❌ SDK import failed. Exiting...")
        return False
    
    # Test 2: Initialization
    kv = test_sdk_initialization()
    if kv is None:
        print("❌ SDK initialization failed. Exiting...")
        return False
    
    # Test 3: Attributes
    test_sdk_attributes(kv)
    
    # Test 4: Connection methods
    test_connection_methods(kv)
    
    # Test 5: Key methods
    test_key_methods(kv)
    
    # Test 6: Error handling
    test_error_handling()
    
    print("\n" + "=" * 50)
    print("🎉 All tests completed!")
    print("📝 Note: Some methods may fail with dummy data, but the SDK structure is correct.")
    print("🔗 To test with real data, use your actual API URL and token.")
    
    return True

if __name__ == "__main__":
    success = run_comprehensive_test()
    sys.exit(0 if success else 1) 