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
  title: 'Key Vault - Secure API Key Management',
  description: 'Centralized key vault for developers to securely store, auto-rotate, and access secrets via SDK. No more plaintext configs or expired API tokens.',
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
