import './globals.css'
import { Inter } from 'next/font/google'
import { JetBrains_Mono } from 'next/font/google'
import Navbar from '../components/Navbar'
import AuthInitializer from '../components/AuthInitializer'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

export const metadata = {
  title: 'API Vault - Secure API Key Management',
  description: 'Centralized API vault for developers to securely store, auto-rotate, and access secrets via SDK. No more plaintext configs or expired API tokens.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/png/32x32-favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/png/48x48-favicon.png', sizes: '48x48', type: 'image/png' },
    ],
    shortcut: '/favicon.svg',
    apple: [
      { url: '/png/48x48-favicon.png', sizes: '48x48', type: 'image/png' },
      { url: '/png/64x64-favicon.png', sizes: '64x64', type: 'image/png' },
    ],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50`}>
        <AuthInitializer />
        <Navbar />
        {children}
      </body>
    </html>
  )
}
