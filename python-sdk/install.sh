#!/bin/bash

echo "Installing Key Vault Python SDK..."

# Check if pip is available
if command -v pip3 &> /dev/null; then
    PIP_CMD="pip3"
elif command -v pip &> /dev/null; then
    PIP_CMD="pip"
else
    echo "Error: pip or pip3 not found. Please install Python and pip first."
    exit 1
fi

# Install from PyPI
echo "Installing from PyPI..."
$PIP_CMD install amay-key-vault-sdk

if [ $? -eq 0 ]; then
    echo "✅ Amay Key Vault SDK installed successfully!"
    echo ""
    echo "You can now use it in your Python code:"
    echo "from key_vault_sdk import KeyVault"
    echo ""
    echo "For more information, visit: https://github.com/amaykorade/key-vault"
else
    echo "❌ Installation failed. Please check your internet connection and try again."
    exit 1
fi 