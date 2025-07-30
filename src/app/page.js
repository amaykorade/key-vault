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
  Play,
  Star,
  Sparkles,
  Terminal,
  Database,
  Cloud,
  Eye,
  Copy,
  Clock,
  TrendingUp,
  ShieldCheck,
  Cpu,
  Server,
  Save,
  RotateCcw
} from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: "Enterprise-Grade Security",
      description: "Military-grade AES-256 encryption with zero-knowledge architecture. Your secrets are encrypted before they leave your device.",
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      icon: Zap,
      title: "Lightning Fast Access",
      description: "Access your API keys in milliseconds with our globally distributed infrastructure and optimized SDK.",
      gradient: "from-amber-500 to-orange-500"
    },
    {
      icon: Globe,
      title: "Global Infrastructure",
      description: "Deployed across multiple regions with automatic failover and 99.9% uptime guarantee.",
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      icon: Code,
      title: "Developer First",
      description: "Simple SDK integration with comprehensive documentation, code examples, and IDE support.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Granular permissions, role-based access control, and secure team sharing without compromising security.",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Monitor usage patterns, track performance metrics, and get detailed insights into your key management.",
      gradient: "from-indigo-500 to-purple-500"
    }
  ];

  const integrations = [
    { name: "Node.js", logo: "🟢", color: "bg-blue-500" },
    { name: "Python", logo: "🐍", color: "bg-yellow-500" },
    { name: "React", logo: "⚛️", color: "bg-blue-500" },
    { name: "Go", logo: "🔵", color: "bg-cyan-500" },
    { name: "Java", logo: "☕", color: "bg-red-500" },
    { name: "PHP", logo: "🐘", color: "bg-purple-500" },
    { name: ".NET", logo: "🟣", color: "bg-purple-600" },
    { name: "Ruby", logo: "💎", color: "bg-red-600" }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Senior DevOps Engineer",
      company: "TechCorp",
      content: "Key Vault has transformed how we manage secrets. The SDK integration is seamless and the security is top-notch.",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO",
      company: "StartupXYZ",
      content: "We switched from managing API keys in spreadsheets to Key Vault. The difference is night and day.",
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "Lead Developer",
      company: "DevStudio",
      content: "The team collaboration features are incredible. We can now securely share keys without worrying about security.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 rounded-full text-sm font-medium mb-8 border border-blue-200">
              <Sparkles className="h-4 w-4 mr-2" />
              Trusted by developers worldwide
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-tight">
              Secure, Rotate, and Access
              <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Your API Keys Effortlessly
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Centralized key vault for developers to securely store, auto-rotate, and access secrets via SDK. 
              No more plaintext configs or expired API tokens.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <a href="/auth/signup" className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all font-semibold text-lg flex items-center space-x-3 shadow-xl hover:shadow-2xl hover:-translate-y-1">
                <span>Get Started for Free</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="/docs" className="px-8 py-4 bg-white text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-semibold text-lg flex items-center space-x-3 border border-slate-200 shadow-lg hover:shadow-xl">
                <Play className="h-5 w-5" />
                <span>See Demo</span>
              </a>
            </div>
            
            {/* Code Demo */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-slate-200/50">
                                  <div className="bg-slate-900 rounded-xl p-6 text-left">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-slate-400 text-sm ml-4 font-mono">Terminal</span>
                    </div>
                    <div className="font-mono text-sm leading-relaxed">
                      <div className="text-blue-400">{`$ npm install amay-key-vault-sdk`}</div>
                      <div className="text-slate-500">{`// Initialize the SDK`}</div>
                      <div className="text-blue-400">{`const kv = new KeyVault('your-api-token');`}</div>
                      <div className="text-slate-500">{`// Retrieve your secrets`}</div>
                      <div className="text-yellow-400">{`const apiKey = await kv.getKeyValue('folder-id', 'api-key');`}</div>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 relative bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Three simple steps to secure, access, and manage your API keys
            </p>
                </div>
                
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Step 1: Store Securely */}
            <div className="text-center group">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-all duration-300 shadow-xl border-4 border-blue-200">
                  <Save className="h-12 w-12 text-white" />
                </div>
                                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  1
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Store Securely</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                Save your API keys in an encrypted, cloud-based vault with military-grade security.
              </p>
            </div>
            
            {/* Step 2: Access Instantly */}
            <div className="text-center group">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-all duration-300 shadow-xl border-4 border-blue-200">
                  <Zap className="h-12 w-12 text-white" />
                    </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  2
                      </div>
                    </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Access Instantly</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                Use your keys securely from anywhere, without hardcoding them in your applications.
              </p>
                  </div>
                  
            {/* Step 3: Rotate Easily */}
            <div className="text-center group">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-all duration-300 shadow-xl border-4 border-purple-200">
                  <RotateCcw className="h-12 w-12 text-white" />
                    </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  3
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Rotate Easily</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                Manually rotate keys when needed. Auto-rotation coming soon for enhanced security.
              </p>
            </div>
          </div>
          
          {/* Visual Flow Arrows */}
          <div className="hidden md:flex justify-center items-center mt-16 mb-12">
            <div className="flex items-center space-x-8">
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <ArrowRight className="h-8 w-8 text-slate-400" />
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              <ArrowRight className="h-8 w-8 text-slate-400" />
              <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
        </div>
          </div>
          
          {/* Call to Action */}
          <div className="text-center">
            <a href="/auth/signup" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all font-semibold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1">
              <span>Get Started for Free</span>
              <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-24 relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8">
              Core Features
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Everything you need to secure and manage your API keys effectively
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* End-to-End Encryption */}
            <div className="group bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 border border-slate-200 hover:border-blue-300 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">End-to-End Encryption</h3>
              <p className="text-slate-600 leading-relaxed">
                Your API keys are encrypted at rest and in transit with military-grade security.
              </p>
            </div>
            
            {/* Easy Manual Key Rotation */}
            <div className="group bg-gradient-to-br from-slate-50 to-purple-50 rounded-2xl p-8 border border-slate-200 hover:border-purple-300 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <RotateCcw className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Easy Manual Key Rotation</h3>
              <p className="text-slate-600 leading-relaxed">
                Rotate your secrets in seconds via the dashboard or API with just a few clicks.
              </p>
            </div>
            
            {/* Centralized Key Access */}
            <div className="group bg-gradient-to-br from-slate-50 to-cyan-50 rounded-2xl p-8 border border-slate-200 hover:border-cyan-300 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Database className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Centralized Key Access</h3>
              <p className="text-slate-600 leading-relaxed">
                One place to manage all your environment secrets with organized folders and projects.
              </p>
            </div>

            {/* Multi-Environment Support */}
            <div className="group bg-gradient-to-br from-slate-50 to-indigo-50 rounded-2xl p-8 border border-slate-200 hover:border-indigo-300 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Multi-Environment Support</h3>
              <p className="text-slate-600 leading-relaxed">
                Organize secrets by dev, staging, and production environments with clear separation.
              </p>
          </div>
          
            {/* Developer-First UX */}
            <div className="group bg-gradient-to-br from-slate-50 to-orange-50 rounded-2xl p-8 border border-slate-200 hover:border-orange-300 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Code className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Developer-First UX</h3>
              <p className="text-slate-600 leading-relaxed">
                Simple, fast UI/UX designed for solo developers and teams alike with intuitive workflows.
              </p>
                  </div>
                  
            {/* Cloud-Hosted & Scalable */}
            <div className="group bg-gradient-to-br from-slate-50 to-indigo-50 rounded-2xl p-8 border border-slate-200 hover:border-indigo-300 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Cloud className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Cloud-Hosted & Scalable</h3>
              <p className="text-slate-600 leading-relaxed">
                Built on secure, scalable infrastructure with zero operations overhead for your team.
              </p>
                    </div>
                  </div>
                  
          {/* Coming Soon Feature */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl p-8 border border-slate-300 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Coming Soon
                </span>
              </div>
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <RotateCcw className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Auto-Rotation</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Automated key rotation for supported platforms. Set it and forget it - your keys will rotate automatically based on your security policies.
                  </p>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 relative bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Why Use Our API Vault Instead of .env Files or DIY Vaults?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              See how our solution compares to traditional approaches
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-200/50 overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                <div className="p-6 border-r border-slate-700">
                  <h3 className="text-lg font-semibold">Feature</h3>
                </div>
                <div className="p-6 border-r border-slate-700 text-center">
                  <h3 className="text-lg font-semibold">.env Files</h3>
                </div>
                <div className="p-6 border-r border-slate-700 text-center">
                  <h3 className="text-lg font-semibold">DIY Vault</h3>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-lg font-semibold">Our Vault</h3>
                </div>
              </div>
              
              {/* Table Rows */}
              <div className="divide-y divide-slate-200">
                {/* Encryption at rest */}
                <div className="grid grid-cols-4 hover:bg-slate-50 transition-colors">
                  <div className="p-6 border-r border-slate-200 flex items-center">
                    <Shield className="h-5 w-5 text-slate-600 mr-3" />
                    <span className="font-medium text-slate-900">Encryption at rest</span>
                  </div>
                  <div className="p-6 border-r border-slate-200 flex items-center justify-center">
                    <span className="text-red-500 text-2xl">❌</span>
                  </div>
                  <div className="p-6 border-r border-slate-200 flex items-center justify-center">
                    <span className="text-blue-500 text-2xl">✅</span>
                  </div>
                  <div className="p-6 flex items-center justify-center">
                    <span className="text-blue-500 text-2xl">✅</span>
                  </div>
                </div>
                
                {/* Rotation support */}
                <div className="grid grid-cols-4 hover:bg-slate-50 transition-colors">
                  <div className="p-6 border-r border-slate-200 flex items-center">
                    <RotateCcw className="h-5 w-5 text-slate-600 mr-3" />
                    <span className="font-medium text-slate-900">Rotation support</span>
                  </div>
                  <div className="p-6 border-r border-slate-200 flex items-center justify-center">
                    <span className="text-red-500 text-2xl">❌</span>
                  </div>
                  <div className="p-6 border-r border-slate-200 flex items-center justify-center">
                    <span className="text-yellow-500 text-sm font-medium">🔸 Manual</span>
                  </div>
                  <div className="p-6 flex items-center justify-center">
                    <span className="text-blue-500 text-sm font-medium">✅ Manual</span>
                  </div>
                  </div>
                  
                {/* Developer-friendly UI */}
                <div className="grid grid-cols-4 hover:bg-slate-50 transition-colors">
                  <div className="p-6 border-r border-slate-200 flex items-center">
                    <Code className="h-5 w-5 text-slate-600 mr-3" />
                    <span className="font-medium text-slate-900">Developer-friendly UI</span>
                  </div>
                  <div className="p-6 border-r border-slate-200 flex items-center justify-center">
                    <span className="text-red-500 text-2xl">❌</span>
                  </div>
                  <div className="p-6 border-r border-slate-200 flex items-center justify-center">
                    <span className="text-red-500 text-2xl">❌</span>
                      </div>
                  <div className="p-6 flex items-center justify-center">
                    <span className="text-green-500 text-2xl">✅</span>
                      </div>
                    </div>
                    
                {/* Access via API */}
                <div className="grid grid-cols-4 hover:bg-slate-50 transition-colors">
                  <div className="p-6 border-r border-slate-200 flex items-center">
                    <Zap className="h-5 w-5 text-slate-600 mr-3" />
                    <span className="font-medium text-slate-900">Access via API</span>
                  </div>
                  <div className="p-6 border-r border-slate-200 flex items-center justify-center">
                    <span className="text-red-500 text-2xl">❌</span>
                  </div>
                  <div className="p-6 border-r border-slate-200 flex items-center justify-center">
                    <span className="text-yellow-500 text-sm font-medium">🔸 Hard</span>
                      </div>
                  <div className="p-6 flex items-center justify-center">
                    <span className="text-blue-500 text-sm font-medium">✅ Easy</span>
                      </div>
                    </div>
                    
                {/* Secrets versioning */}
                <div className="grid grid-cols-4 hover:bg-slate-50 transition-colors">
                  <div className="p-6 border-r border-slate-200 flex items-center">
                    <Clock className="h-5 w-5 text-slate-600 mr-3" />
                    <span className="font-medium text-slate-900">Secrets versioning</span>
                  </div>
                  <div className="p-6 border-r border-slate-200 flex items-center justify-center">
                    <span className="text-red-500 text-2xl">❌</span>
                  </div>
                  <div className="p-6 border-r border-slate-200 flex items-center justify-center">
                    <span className="text-blue-500 text-2xl">✅</span>
                      </div>
                  <div className="p-6 flex items-center justify-center">
                    <span className="text-blue-500 text-2xl">✅</span>
                      </div>
                    </div>
                
                {/* Multi-env support */}
                <div className="grid grid-cols-4 hover:bg-slate-50 transition-colors">
                  <div className="p-6 border-r border-slate-200 flex items-center">
                    <Globe className="h-5 w-5 text-slate-600 mr-3" />
                    <span className="font-medium text-slate-900">Multi-env support</span>
                  </div>
                  <div className="p-6 border-r border-slate-200 flex items-center justify-center">
                    <span className="text-red-500 text-2xl">❌</span>
                  </div>
                  <div className="p-6 border-r border-slate-200 flex items-center justify-center">
                    <span className="text-yellow-500 text-sm font-medium">🔸 Some</span>
                  </div>
                  <div className="p-6 flex items-center justify-center">
                    <span className="text-blue-500 text-2xl">✅</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security First Section */}
      <section className="py-20 relative bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Built with Security as a First-Class Citizen
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Enterprise-grade security measures to protect your most sensitive data
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* AES-256 encryption */}
            <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-blue-400/50 transition-all hover:shadow-2xl hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Shield className="h-6 w-6 text-white" />
                </div>
              <h3 className="text-xl font-bold text-white mb-4">AES-256 Encryption</h3>
              <p className="text-slate-300 leading-relaxed">
                Military-grade encryption ensures your API keys are protected at rest and in transit with industry-standard AES-256.
              </p>
                  </div>

            {/* Cloudflare/Firewall protection */}
            <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-emerald-400/50 transition-all hover:shadow-2xl hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Globe className="h-6 w-6 text-white" />
                  </div>
              <h3 className="text-xl font-bold text-white mb-4">Cloudflare Protection</h3>
              <p className="text-slate-300 leading-relaxed">
                Enterprise-grade DDoS protection and firewall security powered by Cloudflare&apos;s global network infrastructure.
              </p>
                </div>

            {/* HTTPS enforced */}
            <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-blue-400/50 transition-all hover:shadow-2xl hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">HTTPS Enforced</h3>
              <p className="text-slate-300 leading-relaxed">
                All connections are secured with TLS 1.3 encryption and HTTPS is strictly enforced across all endpoints.
            </p>
          </div>
          
            {/* No plaintext logs */}
            <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-emerald-400/50 transition-all hover:shadow-2xl hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">No Plaintext Logs</h3>
              <p className="text-slate-300 leading-relaxed">
                Sensitive data is never logged in plaintext. All audit trails are encrypted and secure by design.
              </p>
            </div>
            
            {/* Access control */}
            <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-emerald-400/50 transition-all hover:shadow-2xl hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Users className="h-6 w-6 text-white" />
               </div>
              <h3 className="text-xl font-bold text-white mb-4">Access Control</h3>
              <p className="text-slate-300 leading-relaxed">
                Granular permissions and role-based access control. Team RBAC coming soon for enterprise teams.
              </p>
            </div>
            
            {/* SOC 2 Compliance */}
            <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-emerald-400/50 transition-all hover:shadow-2xl hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Compliance Ready</h3>
              <p className="text-slate-300 leading-relaxed">
                Built with compliance in mind. SOC 2 Type II certification and GDPR compliance for enterprise customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Built for Developers Section */}
      <section className="py-20 relative bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Built for Developers
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Designed with real-world developer workflows in mind
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Solo developers */}
            <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-slate-200/50 hover:border-blue-300 transition-all hover:shadow-2xl hover:-translate-y-1">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                  <span className="text-2xl">🧑‍💻</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Solo Developers</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Manage multiple API integrations across different projects without the hassle of scattered .env files. Keep all your secrets organized and secure in one place.
                  </p>
                </div>
              </div>
            </div>

            {/* SaaS startups */}
            <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-slate-200/50 hover:border-blue-300 transition-all hover:shadow-2xl hover:-translate-y-1">
              <div className="flex items-start space-x-4">
                                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                  <span className="text-2xl">🛠️</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">SaaS Startups</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Handle secrets across dev, staging, and production environments with confidence. Scale your security practices as your team and infrastructure grows.
                  </p>
                </div>
              </div>
            </div>

            {/* Teams */}
            <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-slate-200/50 hover:border-purple-300 transition-all hover:shadow-2xl hover:-translate-y-1">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                  <span className="text-2xl">🤝</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Team Collaboration</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Shared secure access for teams with granular permissions and role-based access control. Team features coming soon for seamless collaboration.
                  </p>
                </div>
              </div>
            </div>

            {/* Key rotation */}
            <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-slate-200/50 hover:border-orange-300 transition-all hover:shadow-2xl hover:-translate-y-1">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                  <span className="text-2xl">🔁</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Key Rotation</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Easily rotate keys from Stripe, SendGrid, Firebase, and other services manually. Set up automated rotation policies for enhanced security.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-20 relative bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Roadmap / What&apos;s Coming Next
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Exciting features on the horizon to make your development workflow even better
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            {/* Timeline */}
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-500 to-indigo-500 h-full rounded-full"></div>
              
              {/* Timeline Items */}
              <div className="space-y-12">
                {/* Auto key rotation */}
                <div className="relative flex items-center">
                  <div className="w-1/2 pr-8 text-right">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-blue-400/50 transition-all hover:shadow-2xl">
                      <div className="flex items-center justify-end space-x-3 mb-3">
                        <span className="text-2xl">🔁</span>
                        <h3 className="text-xl font-bold text-white">Auto Key Rotation</h3>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        Automated key rotation for supported platforms. Set policies and let the system handle the rest.
                      </p>
                    </div>
                  </div>
                  
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-500 rounded-full border-4 border-slate-900 shadow-lg"></div>
                  
                  <div className="w-1/2 pl-8"></div>
                </div>

                {/* Role-based access */}
                <div className="relative flex items-center">
                  <div className="w-1/2 pr-8"></div>
                  
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-500 rounded-full border-4 border-slate-900 shadow-lg"></div>
                  
                  <div className="w-1/2 pl-8">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-blue-400/50 transition-all hover:shadow-2xl">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">🔐</span>
                        <h3 className="text-xl font-bold text-white">Role-Based Access</h3>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        Granular permissions and role-based access control for enterprise teams and organizations.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Usage analytics */}
                <div className="relative flex items-center">
                  <div className="w-1/2 pr-8 text-right">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-purple-400/50 transition-all hover:shadow-2xl">
                      <div className="flex items-center justify-end space-x-3 mb-3">
                        <span className="text-2xl">📊</span>
                        <h3 className="text-xl font-bold text-white">Usage Analytics</h3>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        Detailed insights into key usage patterns, access logs, and security metrics.
                      </p>
                    </div>
                  </div>
                  
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-purple-500 rounded-full border-4 border-slate-900 shadow-lg"></div>
                  
                  <div className="w-1/2 pl-8"></div>
                </div>

                {/* Public APIs & SDKs */}
                <div className="relative flex items-center">
                  <div className="w-1/2 pr-8"></div>
                  
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-pink-500 rounded-full border-4 border-slate-900 shadow-lg"></div>
                  
                  <div className="w-1/2 pl-8">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-pink-400/50 transition-all hover:shadow-2xl">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">🌍</span>
                        <h3 className="text-xl font-bold text-white">Public APIs & SDKs</h3>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        Comprehensive REST APIs and SDKs for Node.js, Python, Go, and more languages.
                      </p>
                    </div>
                  </div>
                </div>

                {/* GitHub/GitLab integrations */}
                <div className="relative flex items-center">
                  <div className="w-1/2 pr-8 text-right">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-orange-400/50 transition-all hover:shadow-2xl">
                      <div className="flex items-center justify-end space-x-3 mb-3">
                        <span className="text-2xl">🧩</span>
                        <h3 className="text-xl font-bold text-white">GitHub/GitLab Integrations</h3>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        Seamless integration with your existing Git workflows and CI/CD pipelines.
                      </p>
                    </div>
                  </div>
                  
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-orange-500 rounded-full border-4 border-slate-900 shadow-lg"></div>
                  
                  <div className="w-1/2 pl-8"></div>
                </div>

                {/* Vault sharing */}
                <div className="relative flex items-center">
                  <div className="w-1/2 pr-8"></div>
                  
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-cyan-500 rounded-full border-4 border-slate-900 shadow-lg"></div>
                  
                  <div className="w-1/2 pl-8">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-cyan-400/50 transition-all hover:shadow-2xl">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">📁</span>
                        <h3 className="text-xl font-bold text-white">Vault Sharing</h3>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        Share vaults securely with team members with fine-grained access controls.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative bg-gradient-to-br from-blue-500 to-indigo-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Get Started in Minutes
            </h2>
                          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-12">
              No credit card. No friction. Just security and control.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                              <a href="/auth/signup" className="group px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all font-semibold text-lg flex items-center space-x-3 shadow-xl hover:shadow-2xl hover:-translate-y-1">
                <span>Create Free Vault</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
                              <a href="/docs" className="px-8 py-4 bg-blue-600/20 backdrop-blur-sm text-white rounded-xl hover:bg-blue-600/30 transition-all font-semibold text-lg flex items-center space-x-3 border border-white/20 shadow-xl hover:shadow-2xl hover:-translate-y-1">
                <Play className="h-5 w-5" />
                <span>See Demo</span>
              </a>
            </div>
            </div>
        </div>
      </section>

      

      {/* CTA Section */}
      {/* <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-white shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to secure your API keys?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of developers who trust API Vault for their API key management
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/auth/signup" className="px-8 py-4 bg-white text-teal-600 rounded-xl hover:bg-gray-50 transition-all font-semibold text-lg shadow-lg">
                Start Free Trial
              </a>
              <a href="/docs" className="px-8 py-4 bg-teal-500 text-white rounded-xl hover:bg-teal-400 transition-all font-semibold text-lg border border-teal-400 shadow-lg">
                View Documentation
              </a>
            </div>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img src="/logo-large.svg" alt="API Vault" className="h-8 w-8" />
                <span className="text-xl font-bold">API Vault</span>
              </div>
              <p className="text-slate-300 mb-4 max-w-md">
                Secure, rotate, and access your API keys effortlessly. Built for developers who care about security.
              </p>
              <div className="flex items-center space-x-4">
                <span className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-semibold rounded-full border border-blue-500/30">
                  🚀 MVP Live
                </span>
                <div className="flex space-x-3">
                  <a href="https://github.com" className="text-slate-400 hover:text-white transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                  <a href="https://twitter.com" className="text-slate-400 hover:text-white transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-slate-300">
                <li><a href="/docs" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="/pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/integrations" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-300">
                <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="border-t border-slate-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              &copy; 2025 API Vault. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-slate-400 text-sm">Made with ❤️ for developers</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
