import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from '../components/Navbar';
import AuthProvider from '../components/AuthProvider';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Key Vault - Secure API Key Management",
  description: "Centralized key vault for developers to securely store, auto-rotate, and access secrets via SDK. No more plaintext configs or expired API tokens.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50`}>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
