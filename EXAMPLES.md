# Key Vault Python SDK Examples

This directory contains example files demonstrating how to use the `amay-key-vault-sdk` package.

## 📦 Installation

First, install the SDK:
```bash
pip install amay-key-vault-sdk
```

## 📁 Example Files

### 1. `example_usage.py` - Basic Usage
A simple example showing the basic functionality of the SDK:
- Initialize the SDK
- List folders
- List keys in a folder
- Fetch a specific key by name
- Fetch a key by ID

**Run it:**
```bash
python3 example_usage.py
```

### 2. `practical_example.py` - Real-world Application
A more practical example showing how to integrate the SDK into your application:
- Create a configuration class
- Handle different types of errors
- Get database URLs and API keys
- Demonstrate proper error handling

**Run it:**
```bash
python3 practical_example.py
```

### 3. `env_example.py` - Environment Variables
Shows best practices for using environment variables with the SDK:
- Use environment variables for configuration
- Secure token handling
- Production-ready setup

**Run it:**
```bash
python3 env_example.py
```

### 4. `test_sdk.py` - Comprehensive Testing
A comprehensive test file that validates all SDK functionality:
- Tests all major SDK methods
- Validates error handling
- Confirms the bug fix is working

**Run it:**
```bash
python3 test_sdk.py
```

## 🔧 Configuration

Before running the examples, update the configuration in each file:

```python
API_URL = "https://apivault.it.com/api"  # Your API URL
TOKEN = "your-api-token-here"            # Your API token
FOLDER_ID = "your-folder-id"             # Your folder ID
KEY_NAME = "your-key-name"               # The key you want to fetch
```

## 🌍 Environment Variables (Recommended)

For production use, set these environment variables:

```bash
export KEY_VAULT_API_URL="https://apivault.it.com/api"
export KEY_VAULT_TOKEN="your-api-token-here"
export KEY_VAULT_FOLDER_ID="your-folder-id"
export KEY_VAULT_KEY_NAME="your-key-name"
```

Then use the `env_example.py` file which reads from these environment variables.

## 🚀 Quick Start

1. **Install the SDK:**
   ```bash
   pip install amay-key-vault-sdk
   ```

2. **Get your credentials:**
   - API URL from your Key Vault instance
   - API token from your Key Vault dashboard
   - Folder ID from your Key Vault folders
   - Key name you want to fetch

3. **Run an example:**
   ```bash
   python3 example_usage.py
   ```

## 📚 SDK Methods

The SDK provides these main methods:

- `list_folders()` - List all folders
- `list_keys(folder_id)` - List keys in a folder
- `get_key(key_id, include_value=True)` - Get a key by ID
- `get_key_by_name(folder_id, key_name)` - Get a key by name

## 🔒 Security Best Practices

1. **Never hardcode tokens** - Use environment variables
2. **Rotate tokens regularly** - Update your API tokens periodically
3. **Use least privilege** - Only grant necessary permissions to your API tokens
4. **Monitor usage** - Keep track of API calls and usage patterns

## 🐛 Troubleshooting

If you encounter issues:

1. **Check your API token** - Ensure it's valid and has the right permissions
2. **Verify folder ID** - Make sure the folder exists and you have access
3. **Check network connectivity** - Ensure you can reach the API URL
4. **Update the SDK** - Make sure you're using the latest version:
   ```bash
   pip install --upgrade amay-key-vault-sdk
   ```

## 📖 Documentation

For more detailed documentation, visit:
- [PyPI Package](https://pypi.org/project/amay-key-vault-sdk/)
- [GitHub Repository](https://github.com/amaykorade/key-vault)

## 🆘 Support

If you need help:
1. Check the [GitHub Issues](https://github.com/amaykorade/key-vault/issues)
2. Review the [README](https://github.com/amaykorade/key-vault#readme)
3. Create a new issue with details about your problem 