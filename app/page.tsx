"use client"

import { useState } from "react"
import { SplashScreen } from "@/components/splash-screen"
import { LocationService } from "@/components/location-service"
import { AppContent } from "@/components/app-content"

export default function Page() {
  const [showSplash, setShowSplash] = useState(true)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  const handleLocationUpdate = (location: { lat: number; lng: number }) => {
    setUserLocation(location)
  }

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  return (
    <LocationService onLocationUpdate={handleLocationUpdate}>
      <AppContent userLocation={userLocation} />
    </LocationService>
  )
}
