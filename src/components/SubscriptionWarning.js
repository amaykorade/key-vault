'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default function SubscriptionWarning() {
  const [warning, setWarning] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    fetchSubscriptionWarning()
  }, [])

  const fetchSubscriptionWarning = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/subscription/warning', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.warning) {
          setWarning(data.warning)
        }
      }
    } catch (error) {
      console.error('Error fetching subscription warning:', error)
    } finally {
      setLoading(false)
    }
  }

  const dismissWarning = async () => {
    try {
      const response = await fetch('/api/subscription/warning', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dismiss: true })
      })
      
      if (response.ok) {
        setDismissed(true)
        // Store dismissal in localStorage to prevent showing again for 24 hours
        localStorage.setItem('subscriptionWarningDismissed', Date.now().toString())
      }
    } catch (error) {
      console.error('Error dismissing warning:', error)
    }
  }

  // Check if warning was dismissed recently
  useEffect(() => {
    const dismissedTime = localStorage.getItem('subscriptionWarningDismissed')
    if (dismissedTime) {
      const hoursSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60)
      if (hoursSinceDismissed < 24) {
        setDismissed(true)
      } else {
        localStorage.removeItem('subscriptionWarningDismissed')
      }
    }
  }, [])

  if (loading || dismissed || !warning) {
    return null
  }

  const getWarningColor = (type) => {
    switch (type) {
      case 'expired':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'expiring_soon':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'expiring_today':
        return 'bg-orange-50 border-orange-200 text-orange-800'
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  const getWarningIcon = (type) => {
    switch (type) {
      case 'expired':
        return '🔴'
      case 'expiring_soon':
        return '⚠️'
      case 'expiring_today':
        return '🚨'
      default:
        return 'ℹ️'
    }
  }

  const getWarningMessage = (warning) => {
    switch (warning.type) {
      case 'expired':
        return 'Your subscription has expired. Renew now to continue accessing your keys and projects.'
      case 'expiring_soon':
        return `Your subscription expires in ${warning.daysUntilExpiry} days. Renew now to avoid service interruption.`
      case 'expiring_today':
        return 'Your subscription expires today! Renew now to maintain access to your keys and projects.'
      default:
        return warning.message || 'Subscription warning'
    }
  }

  return (
    <div className={`mb-6 p-4 border rounded-lg ${getWarningColor(warning.type)}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium">
              {getWarningIcon(warning.type)} Subscription Warning
            </h3>
            <p className="mt-1 text-sm">
              {getWarningMessage(warning)}
            </p>
            <div className="mt-3 flex space-x-3">
              <a
                href="/pricing"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Renew Subscription
              </a>
              <button
                onClick={dismissWarning}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={dismissWarning}
          className="flex-shrink-0 ml-3"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
} 