'use client'

import React, { useState, useEffect } from 'react';
import useAuthStore from '../../stores/authStore';
import Link from 'next/link';

export default function ApiPage() {
  const { user } = useAuthStore();
  const [token, setToken] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [regenLoading, setRegenLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiUrl, setApiUrl] = useState('');

  useEffect(() => {
    setApiUrl(window.location.origin + '/api');
  }, []);

  useEffect(() => {
    if (user) fetchToken();
  }, [user]);

  const fetchToken = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/api-token', { credentials: 'include' });
      const data = await res.json();
      if (res.ok) setToken(data.token);
      else setError(data.error || 'Failed to fetch token');
    } catch (err) {
      setError('Failed to fetch token');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {}
  };

  const handleRegenerate = async () => {
    setRegenLoading(true);
    setError('');
    try {
      const res = await fetch('/api/api-token', { method: 'POST', credentials: 'include' });
      const data = await res.json();
      if (res.ok) setToken(data.token);
      else setError(data.error || 'Failed to regenerate token');
    } catch (err) {
      setError('Failed to regenerate token');
    } finally {
      setRegenLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center items-start">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">API Access</h1>
        <p className="text-gray-600 mb-6">
          Use the following API base URL and your personal API token to access the Key Vault SDK and REST API.
        </p>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">API Base URL</h2>
        <div className="bg-gray-900 rounded-lg p-3 text-sm font-mono select-all mb-6 text-gray-100 border border-gray-800">
          {apiUrl}
        </div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Your API Token</h2>
        {loading ? (
          <div className="text-gray-500 mb-4">Loading token...</div>
        ) : error ? (
          <div className="text-red-600 mb-4">{error}</div>
        ) : (
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={token}
              readOnly
              className="w-full bg-gray-900 px-3 py-2 border border-gray-300 rounded bg-gray-50 font-mono  text-sm"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={handleRegenerate}
              className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              disabled={regenLoading}
            >
              {regenLoading ? 'Regenerating...' : 'Regenerate'}
            </button>
          </div>
        )}
        <p className="text-xs text-gray-500 mb-8">
          Keep your API token secure. Do not share it or expose it in client-side code.
        </p>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h2>
        <ul className="list-disc pl-5 mb-8 text-gray-700">
          <li>Use the API base URL and your token in the SDK or direct API requests.</li>
          <li>You can regenerate your token at any time. This will invalidate the previous token.</li>
        </ul>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">SDK Quick Start</h2>
        <pre className="bg-gray-100 rounded-lg p-4 text-sm text-gray-400 overflow-x-auto mb-4 border border-gray-200">
          <code>{`import KeyVault from 'key-vault-sdk';

const kv = new KeyVault({
  apiUrl: '${apiUrl}',
  token: '${token || 'YOUR_API_TOKEN'}',
});

// List keys
const { keys } = await kv.listKeys({ folderId: 'FOLDER_ID' });

// Get a key
const key = await kv.getKey('KEY_ID', { includeValue: true });
`}</code>
        </pre>
        <Link href="/docs" className="text-blue-600 hover:underline font-medium">
          Read full SDK documentation
        </Link>
      </div>
    </div>
  );
} 