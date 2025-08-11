# Publishing Guide for Key Vault SDKs

This guide covers how to publish both the JavaScript and Python SDKs to their respective package registries.

## Prerequisites

### For JavaScript SDK (npm):
1. **npm account**: Create an account at [npmjs.com](https://npmjs.com)
2. **Login**: Run `npm login` in your terminal
3. **Verify ownership**: Ensure you own the package name `amay-key-vault-sdk`

### For Python SDK (PyPI):
1. **PyPI account**: Create an account at [pypi.org](https://pypi.org)
2. **TestPyPI account**: Create an account at [test.pypi.org](https://test.pypi.org) for testing
3. **Install tools**: `pip install twine build`

## JavaScript SDK Publishing

### 1. Build the Package
```bash
cd sdk
npm run build
```

### 2. Test the Build
```bash
# Check what will be published
npm pack

# This creates a .tgz file - inspect its contents
tar -tzf amay-key-vault-sdk-1.0.4.tgz
```

### 3. Publish to npm
```bash
# Publish to npm registry
npm publish

# Or publish with specific tag
npm publish --tag latest
```

### 4. Verify Publication
- Check [npmjs.com/package/amay-key-vault-sdk](https://npmjs.com/package/amay-key-vault-sdk)
- Test installation: `npm install amay-key-vault-sdk`

## Python SDK Publishing

### 1. Build the Package
```bash
cd python-sdk
python -m build
```

### 2. Test the Build
```bash
# Check what will be published
python -m build --sdist --wheel

# This creates dist/ directory with source and wheel distributions
ls dist/
```

### 3. Test on TestPyPI (Recommended First)
```bash
# Upload to TestPyPI first
twine upload --repository testpypi dist/*

# Test installation from TestPyPI
pip install --index-url https://test.pypi.org/simple/ amay-key-vault-sdk
```

### 4. Publish to PyPI
```bash
# Upload to production PyPI
twine upload dist/*
```

### 5. Verify Publication
- Check [pypi.org/project/amay-key-vault-sdk](https://pypi.org/project/amay-key-vault-sdk)
- Test installation: `pip install amay-key-vault-sdk`

## Version Management

### Updating Versions
When making changes:

1. **JavaScript SDK**: Update `sdk/package.json` version
2. **Python SDK**: Update `python-sdk/setup.py` version
3. **Update CHANGELOG.md** with release notes
4. **Tag the release** in git: `git tag v1.0.4`

### Version Format
Use semantic versioning: `MAJOR.MINOR.PATCH`
- `1.0.4` - Current version
- `1.1.0` - New features
- `2.0.0` - Breaking changes

## Publishing Checklist

### Before Publishing:
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] Version numbers are updated in both packages
- [ ] Build process works correctly
- [ ] Package contents are correct

### After Publishing:
- [ ] Verify packages appear on respective registries
- [ ] Test installation from registries
- [ ] Update documentation with installation instructions
- [ ] Tag the git release
- [ ] Announce the release

## Troubleshooting

### Common Issues:

1. **Package name already taken**: Choose a different name or contact the owner
2. **Authentication errors**: Re-run `npm login` or check PyPI credentials
3. **Build failures**: Check dependencies and build configuration
4. **Version conflicts**: Ensure version numbers are unique and follow semver

### Rollback:
If you need to unpublish:
- **npm**: `npm unpublish amay-key-vault-sdk@1.0.4` (within 72 hours)
- **PyPI**: Use the web interface to delete specific versions

## Security Considerations

- Never commit API keys or secrets
- Use `.npmrc` for npm authentication (don't commit it)
- Use environment variables for PyPI credentials
- Regularly rotate authentication tokens

## Next Steps

1. **Test the build process** for both packages
2. **Create accounts** on npm and PyPI if you haven't already
3. **Test on TestPyPI** first for the Python package
4. **Publish to production** registries
5. **Update your documentation** with installation instructions

## Support

If you encounter issues:
- Check the respective registry documentation
- Review build logs and error messages
- Ensure all dependencies are properly configured
- Verify authentication credentials 