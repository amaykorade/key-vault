'use client'

import React from 'react';
import { 
  Key, 
  Shield, 
  Zap, 
  Globe, 
  Code, 
  Lock, 
  Users, 
  BarChart3, 
  CheckCircle, 
  ArrowRight, 
  Play
} from 'lucide-react';

const HomePage = () => {

  const features = [
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption and security protocols to keep your API keys and secrets safe from unauthorized access."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Access your API keys instantly with our high-performance SDK and RESTful API endpoints."
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Access your keys from anywhere in the world with our globally distributed infrastructure."
    },
    {
      icon: Code,
      title: "Developer Friendly",
      description: "Simple SDK integration with comprehensive documentation and code examples for all major languages."
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Collaborate with your team, manage permissions, and control access levels for different environments."
    },
    {
      icon: BarChart3,
      title: "Usage Analytics",
      description: "Monitor API key usage, track performance metrics, and get detailed analytics and insights."
    }
  ];

  const integrations = [
    { name: "Node.js", logo: "🟢" },
    { name: "Python", logo: "🐍" },
    { name: "React", logo: "⚛️" },
    { name: "Go", logo: "🔵" },
    { name: "Java", logo: "☕" },
    { name: "PHP", logo: "🐘" }
  ];



  return (
    <div className="min-h-screen bg-gray-800">

      {/* Hero Section */}
      <section className="pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-900 text-blue-200 rounded-full text-sm font-medium mb-8">
              <Shield className="h-4 w-4 mr-2" />
              Trusted by 10,000+ developers worldwide
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Secure API Key
              <span className="text-blue-400 block">Management Made Simple</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Store, manage, and access your API keys and secrets with enterprise-grade security. 
              Our platform provides seamless integration with your applications through our powerful SDK and RESTful API.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                             <a href="/auth/signup" className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg flex items-center space-x-2 shadow-lg">
                 <span>Start Free Trial</span>
                 <ArrowRight className="h-5 w-5" />
               </a>
               <a href="/docs" className="px-8 py-4 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors font-semibold text-lg flex items-center space-x-2 border-2 border-gray-600">
                 <Play className="h-5 w-5" />
                 <span>View Documentation</span>
               </a>
            </div>
            
                         <div className="mt-16">
               <div className="bg-gray-700/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-600/20 max-w-4xl mx-auto">
                <div className="bg-gray-900 rounded-lg p-6 text-left">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-400 text-sm ml-4">Terminal</span>
                  </div>
                  <div className="font-mono text-sm text-green-400">
                    <div>$ npm install key-vault-sdk</div>
                    <div className="text-gray-400">{'// Initialize the SDK'}</div>
                    <div>const kv = new KeyVault('your-api-token');</div>
                    <div className="text-gray-400">{'// Retrieve your secrets'}</div>
                    <div>const apiKey = await kv.getKeyValue('folder-id', 'api-key');</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Storing API Keys Shouldn&apos;t Be This Hard
            </h2>
            
            {/* Problem */}
            <div className="bg-gray-700/60 backdrop-blur-sm rounded-xl p-8 mb-12 max-w-4xl mx-auto border border-gray-600/20 shadow-lg">
              <h3 className="text-xl font-semibold text-red-400 mb-6">The Current Pain Points:</h3>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-red-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-300 text-sm font-bold">😱</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Scattered Everywhere</h4>
                    <p className="text-gray-300">API keys lost in Notion docs, Slack messages, and .env files scattered across projects</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-red-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-300 text-sm font-bold">🔥</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Version Control Mess</h4>
                    <p className="text-gray-300">Accidentally committed secrets, outdated keys, and no proper rotation strategy</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-red-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-300 text-sm font-bold">🚫</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">No Access Control</h4>
                    <p className="text-gray-300">Team members can&apos;t access keys securely, leading to unsafe sharing practices</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Solution */}
            <div className="bg-gradient-to-r from-green-900 to-blue-900 rounded-xl p-8 max-w-4xl mx-auto border border-gray-600/20 shadow-lg">
              <h3 className="text-xl font-semibold text-green-400 mb-6">Our Simple Solution:</h3>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-800 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="h-4 w-4 text-green-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Secure Vault</h4>
                    <p className="text-gray-300">Enterprise-grade encryption with centralized, organized key storage</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-800 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Code className="h-4 w-4 text-green-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">SDK Access</h4>
                    <p className="text-gray-300">One-line code integration - access your keys instantly from any application</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-800 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Globe className="h-4 w-4 text-green-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Developer-Friendly</h4>
                    <p className="text-gray-300">CLI, REST API, and beautiful dashboard - use whatever fits your workflow</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="py-20 bg-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Everything you need in one place
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Built for developers, trusted by teams
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-gray-600/20 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-6">🔒</div>
              <h3 className="text-xl font-semibold text-white mb-4">End-to-End Encryption</h3>
              <p className="text-gray-300 leading-relaxed">Military-grade AES-256 encryption ensures your secrets are always protected, even from us.</p>
            </div>
            
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-gray-600/20 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-6">⚡</div>
              <h3 className="text-xl font-semibold text-white mb-4">Instant SDK Access</h3>
              <p className="text-gray-300 leading-relaxed">One line of code to access your keys. No more hunting through files or repositories.</p>
            </div>
            
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-gray-600/20 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-6">👥</div>
              <h3 className="text-xl font-semibold text-white mb-4">Team Sharing & Access Roles</h3>
              <p className="text-gray-300 leading-relaxed">Granular permissions and secure team sharing without compromising security.</p>
            </div>
            
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-gray-600/20 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-6">🌐</div>
              <h3 className="text-xl font-semibold text-white mb-4">REST + CLI + Dashboard</h3>
              <p className="text-gray-300 leading-relaxed">Multiple ways to interact - use what works best for your development workflow.</p>
            </div>
            
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-gray-600/20 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-6">🧪</div>
              <h3 className="text-xl font-semibold text-white mb-4">Secrets History & Expiry</h3>
              <p className="text-gray-300 leading-relaxed">
                <span>Track changes and set expiration dates for automatic rotation.</span>
                <span className="inline-block mt-2 px-2 py-1 bg-blue-900 text-blue-200 text-xs rounded-full">Coming Soon</span>
              </p>
            </div>
            
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-gray-600/20 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-6">📁</div>
              <h3 className="text-xl font-semibold text-white mb-4">Folder-Based Organization</h3>
              <p className="text-gray-300 leading-relaxed">Organize keys by project, environment, or any structure that makes sense for your team.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Get started in 3 simple steps
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              From setup to accessing your keys in production - it takes less than 5 minutes
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto mb-20">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-blue-700">
                <span className="text-3xl font-bold text-blue-300">1</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-6">Create Account</h3>
              <p className="text-gray-300 leading-relaxed text-lg">Sign up with your email. No credit card required for the free tier.</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-blue-700">
                <span className="text-3xl font-bold text-blue-300">2</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-6">Store Your Keys</h3>
              <p className="text-gray-300 leading-relaxed text-lg">Use our dashboard to securely store your API keys and secrets.</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-blue-700">
                <span className="text-3xl font-bold text-blue-300">3</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-6">Access from Code</h3>
              <p className="text-gray-300 leading-relaxed text-lg">Install our SDK and access your keys with a simple function call.</p>
            </div>
          </div>
          
          {/* Visual Flow */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-gray-700/60 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-gray-600/20">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-gray-900 rounded-xl p-6 text-green-400 font-mono text-base">
                  <div className="text-gray-400 mb-3 text-sm"># Step 2: Store keys</div>
                  <div className="mb-2">$ secure-keys set prod-db</div>
                  <div className="text-gray-400 mb-2">Enter value: ••••••••</div>
                  <div className="text-green-400">✓ Stored securely</div>
                </div>
                
                <div className="bg-gray-900 rounded-xl p-6 text-green-400 font-mono text-base">
                  <div className="text-gray-400 mb-3 text-sm"># Step 3: Access in code</div>
                  <div className="mb-2">
                    <span className="text-blue-300">const</span> key = 
                    <span className="text-yellow-300">await</span> keys.get(
                    <span className="text-green-300">&apos;prod-db&apos;</span>);
                  </div>
                  <div className="text-gray-400">{/* Access your secret */}</div>
                </div>
                
                <div className="bg-gray-900 rounded-xl p-6 text-green-400 font-mono text-base">
                  <div className="text-gray-400 mb-3 text-sm"># Result</div>
                  <div className="text-green-400 mb-2">Connected to DB ✓</div>
                  <div className="text-gray-400">Secure & Fast</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 bg-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              See it in action
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our intuitive dashboard makes managing API keys effortless
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-600/20">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-400 text-sm ml-4">Key Vault Dashboard</span>
                </div>
                
                {/* Mock Dashboard */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white font-semibold">My API Keys</h3>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">+ Add Key</button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-gray-700 rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Stripe API Key</div>
                        <div className="text-gray-400 text-sm">Production • Last used 2h ago</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="bg-green-900 text-green-300 px-2 py-1 rounded text-xs">Active</span>
                        <button className="text-gray-400 hover:text-white">👁️</button>
                        <button className="text-gray-400 hover:text-white">📋</button>
                      </div>
                    </div>
                    
                    <div className="bg-gray-700 rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">OpenAI API Key</div>
                        <div className="text-gray-400 text-sm">Development • Last used 1d ago</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded text-xs">Active</span>
                        <button className="text-gray-400 hover:text-white">👁️</button>
                        <button className="text-gray-400 hover:text-white">📋</button>
                      </div>
                    </div>
                    
                    <div className="bg-gray-700 rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Database URL</div>
                        <div className="text-gray-400 text-sm">Production • Last used 5m ago</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="bg-green-900 text-green-300 px-2 py-1 rounded text-xs">Active</span>
                        <button className="text-gray-400 hover:text-white">👁️</button>
                        <button className="text-gray-400 hover:text-white">📋</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <a href="/docs" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                <Play className="h-5 w-5 mr-2" />
                View Documentation
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Perfect for developers and teams
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Whether you&apos;re building solo or with a team, Key Vault scales with your needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-gray-600/20">
              <div className="text-4xl mb-6">👨‍💻</div>
              <h3 className="text-xl font-semibold text-white mb-4">Solo Developers</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Working on side projects and need a secure, simple way to manage API keys across multiple applications.
              </p>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• Free tier with essential features</li>
                <li>• Quick setup and integration</li>
                <li>• No team management complexity</li>
              </ul>
            </div>
            
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-gray-600/20 border-blue-400 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">Popular</span>
              </div>
              <div className="text-4xl mb-6">🚀</div>
              <h3 className="text-xl font-semibold text-white mb-4">Indie Hackers & SaaS Founders</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Building products and need professional secret management without enterprise complexity.
              </p>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• Multiple environments support</li>
                <li>• Team collaboration features</li>
                <li>• Usage analytics and monitoring</li>
              </ul>
            </div>
            
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-gray-600/20">
              <div className="text-4xl mb-6">👥</div>
              <h3 className="text-xl font-semibold text-white mb-4">Growing Teams</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Teams that need fast onboarding, secure sharing, and don&apos;t want to manage complex infrastructure.
              </p>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• Role-based access control</li>
                <li>• Fast team member onboarding</li>
                <li>• Audit logs and compliance</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-gray-700/60 backdrop-blur-sm rounded-xl p-8 border border-gray-600/20">
              <div className="text-3xl font-bold text-blue-400 mb-2">99.9%</div>
              <div className="text-gray-300 font-medium">Uptime</div>
            </div>
            <div className="bg-gray-700/60 backdrop-blur-sm rounded-xl p-8 border border-gray-600/20">
              <div className="text-3xl font-bold text-blue-400 mb-2">10K+</div>
              <div className="text-gray-300 font-medium">Developers</div>
            </div>
            <div className="bg-gray-700/60 backdrop-blur-sm rounded-xl p-8 border border-gray-600/20">
              <div className="text-3xl font-bold text-blue-400 mb-2">1M+</div>
              <div className="text-gray-300 font-medium">API Keys Secured</div>
            </div>
            <div className="bg-gray-700/60 backdrop-blur-sm rounded-xl p-8 border border-gray-600/20">
              <div className="text-3xl font-bold text-blue-400 mb-2">50+</div>
              <div className="text-gray-300 font-medium">Integrations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section id="integrations" className="py-20 bg-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Integrates with your favorite tools
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our SDK supports all major programming languages and frameworks
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {integrations.map((integration, index) => (
              <div key={index} className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border border-gray-600/20 hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">{integration.logo}</div>
                <div className="font-semibold text-white">{integration.name}</div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <a href="/docs" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              View All Integrations
            </a>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to secure your API keys?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of developers who trust Key Vault for their API key management
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/auth/signup" className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-lg">
                Start Free Trial
              </a>
              <a href="/docs" className="px-8 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-400 transition-colors font-semibold text-lg border border-blue-400">
                View Documentation
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800/80 backdrop-blur-sm border-t border-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="p-2 bg-blue-600 rounded-xl">
                <Key className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Key Vault</span>
            </div>
            
            <div className="flex space-x-6 text-gray-300">
              <a href="/pricing" className="hover:text-blue-400">Pricing</a>
              <a href="/docs" className="hover:text-blue-400">Docs</a>
              <a href="/api" className="hover:text-blue-400">API</a>
            </div>
          </div>
          
          <div className="border-t border-gray-600 mt-6 pt-6 text-center text-gray-400 text-sm">
            <p>&copy; 2025 Key Vault</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
