import { useState } from 'react';

export const TestBackend = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    setTestResults([]);
    const results: any[] = [];

    // Test 1: Health Check (using Vite proxy)
    try {
      console.log('Testing health endpoint via proxy...');
      const response = await fetch('/api/health');
      const data = await response.json();
      results.push({
        test: 'Health Check (Proxy)',
        status: 'SUCCESS',
        url: '/api/health (proxied to backend)',
        response: data
      });
    } catch (error: any) {
      results.push({
        test: 'Health Check (Proxy)',
        status: 'FAILED',
        url: '/api/health',
        error: error.message
      });
    }

    // Test 2: Projects Endpoint (using Vite proxy)
    try {
      console.log('Testing projects endpoint via proxy...');
      const response = await fetch('/api/projects');
      const data = await response.json();
      results.push({
        test: 'Projects Endpoint (Proxy)',
        status: 'SUCCESS',
        url: '/api/projects (proxied to backend)',
        response: `Found ${data.projects?.length || 0} projects`
      });
    } catch (error: any) {
      results.push({
        test: 'Projects Endpoint (Proxy)',
        status: 'FAILED',
        url: '/api/projects',
        error: error.message
      });
    }

    // Test 3: Admin Login (using Vite proxy)
    try {
      console.log('Testing admin login via proxy...');
      const response = await fetch('/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: 'selma2024' })
      });
      const data = await response.json();
      results.push({
        test: 'Admin Login (Proxy)',
        status: 'SUCCESS',
        url: '/admin/login (proxied to backend)',
        response: data.success ? 'Login successful' : 'Login failed'
      });
    } catch (error: any) {
      results.push({
        test: 'Admin Login (Proxy)',
        status: 'FAILED',
        url: '/admin/login',
        error: error.message
      });
    }

    // Test 4: Direct Backend Connection (bypass proxy)
    try {
      console.log('Testing direct backend connection...');
      const response = await fetch('http://localhost:3002/api/health');
      const data = await response.json();
      results.push({
        test: 'Direct Backend Connection',
        status: 'SUCCESS',
        url: 'http://localhost:3002/api/health (direct)',
        response: data
      });
    } catch (error: any) {
      results.push({
        test: 'Direct Backend Connection',
        status: 'FAILED',
        url: 'http://localhost:3002/api/health',
        error: error.message
      });
    }

    setTestResults(results);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    return status === 'SUCCESS' 
      ? 'bg-green-100 border-green-300' 
      : 'bg-red-100 border-red-300';
  };

  const getStatusBadgeColor = (status: string) => {
    return status === 'SUCCESS'
      ? 'bg-green-200 text-green-800'
      : 'bg-red-200 text-red-800';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🧪 Backend Connection Test</h1>
        
        <div className="mb-8 p-6 bg-blue-100 border border-blue-300 rounded-lg">
          <h3 className="font-bold mb-2 text-blue-800">🔧 Testing Strategy:</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• <strong>Proxy Tests:</strong> Use Vite proxy (should work if CORS fixed)</p>
            <p>• <strong>Direct Tests:</strong> Direct backend connection (might fail due to CORS)</p>
            <p>• <strong>Expected:</strong> Proxy tests should be GREEN, direct might be RED</p>
          </div>
        </div>
        
        <button
          onClick={runTests}
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 mb-8 font-medium"
        >
          {loading ? '🔄 Testing...' : '🚀 Run All Tests'}
        </button>

        <div className="space-y-4">
          {testResults.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${getStatusColor(result.status)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg">{result.test}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(result.status)}`}
                >
                  {result.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Endpoint:</strong> {result.url}
              </p>
              {result.response && (
                <div className="text-sm mb-2">
                  <strong>Response:</strong> 
                  <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                    {typeof result.response === 'string' ? result.response : JSON.stringify(result.response, null, 2)}
                  </pre>
                </div>
              )}
              {result.error && (
                <p className="text-sm text-red-600">
                  <strong>Error:</strong> {result.error}
                </p>
              )}
            </div>
          ))}
        </div>

        {testResults.length > 0 && (
          <div className="mt-8 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
            <h3 className="font-bold mb-2">📊 Results Analysis:</h3>
            <div className="text-sm space-y-1">
              {testResults.filter(r => r.status === 'SUCCESS').length === testResults.length ? (
                <p className="text-green-700">✅ All tests passed! Backend connection is working perfectly.</p>
              ) : testResults.some(r => r.test.includes('Proxy') && r.status === 'SUCCESS') ? (
                <p className="text-green-700">✅ Proxy tests working! Admin login should work now.</p>
              ) : (
                <p className="text-red-700">❌ Connection issues detected. Check backend status.</p>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 p-4 bg-gray-100 border border-gray-300 rounded-lg">
          <h3 className="font-bold mb-2">🛠️ Troubleshooting:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Make sure backend is running: <code className="bg-gray-200 px-1 rounded">cd backend && npm run dev</code></li>
            <li>Backend should show: <code className="bg-gray-200 px-1 rounded">Server: http://localhost:3002</code></li>
            <li>If proxy tests fail, restart frontend: <code className="bg-gray-200 px-1 rounded">npm run dev</code></li>
            <li>If direct tests fail but proxy works, that's normal (CORS protection)</li>
          </ol>
        </div>

        <div className="mt-4 flex space-x-4">
          <a
            href="/admin/login"
            className="text-blue-500 hover:text-blue-700 underline"
          >
            ← Try Admin Login
          </a>
          <a
            href="/"
            className="text-green-500 hover:text-green-700 underline"
          >
            🏠 Main Portfolio
          </a>
        </div>
      </div>
    </div>
  );
};