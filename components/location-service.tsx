"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { MapPin, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface LocationServiceProps {
  onLocationUpdate: (location: { lat: number; lng: number }) => void
  children: React.ReactNode
}

export function LocationService({ onLocationUpdate, children }: LocationServiceProps) {
  const [locationStatus, setLocationStatus] = useState<"requesting" | "granted" | "denied" | "unavailable">(
    "requesting",
  )
  const [showLocationPrompt, setShowLocationPrompt] = useState(false)

  useEffect(() => {
    requestLocation()
  }, [])

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("unavailable")
      // Fallback to Kolkata coordinates
      onLocationUpdate({ lat: 22.5726, lng: 88.3639 })
      return
    }

    setLocationStatus("requesting")
    setShowLocationPrompt(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationStatus("granted")
        setShowLocationPrompt(false)
        onLocationUpdate({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (error) => {
        console.error("Location error:", error)
        setLocationStatus("denied")
        setShowLocationPrompt(true)
        // Fallback to Kolkata coordinates
        onLocationUpdate({ lat: 22.5726, lng: 88.3639 })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    )
  }

  const handleRetryLocation = () => {
    requestLocation()
  }

  if (showLocationPrompt && locationStatus !== "granted") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {locationStatus === "denied" ? (
                <AlertCircle className="w-8 h-8 text-red-500" />
              ) : (
                <MapPin className="w-8 h-8 text-blue-500" />
              )}
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {locationStatus === "denied" ? "Location Access Needed" : "Finding Your Location"}
            </h2>

            <p className="text-gray-600 text-sm mb-6">
              {locationStatus === "denied"
                ? "To show you the nearest Puja Pandals and provide accurate directions, we need access to your location. Please enable location services and try again."
                : "We're finding your location to show you the nearest Puja Pandals and provide personalized recommendations."}
            </p>

            {locationStatus === "denied" && (
              <div className="space-y-3">
                <Button onClick={handleRetryLocation} className="w-full bg-blue-600 hover:bg-blue-700">
                  <MapPin className="w-4 h-4 mr-2" />
                  Enable Location
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowLocationPrompt(false)
                    onLocationUpdate({ lat: 22.5726, lng: 88.3639 })
                  }}
                  className="w-full bg-transparent"
                >
                  Continue Without Location
                </Button>
              </div>
            )}

            {locationStatus === "requesting" && (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-sm text-gray-600">Getting your location...</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
