"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation" 
import { SplashScreen } from "@/components/splash-screen"
import { LocationService } from "@/components/location-service"
import { AppContent } from "@/components/app-content"

export default function Page() {
  const [showSplash, setShowSplash] = useState(true)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  // Get the search parameters from the URL
  const searchParams = useSearchParams()

  // Add a useEffect to check for lat/lng in the URL when the component mounts
  useEffect(() => {
    const latParam = searchParams.get("lat")
    const lngParam = searchParams.get("lng")

    // If both lat and lng are present in the URL, use them
    if (latParam && lngParam) {
      const lat = parseFloat(latParam)
      const lng = parseFloat(lngParam)

      // Ensure they are valid numbers before setting the state
      if (!isNaN(lat) && !isNaN(lng)) {
        console.log("📍 Location set from URL parameters:", { lat, lng })
        setUserLocation({ lat, lng })
      }
    }
  }, [searchParams]) // Rerun this effect if searchParams change

  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  const handleLocationUpdate = (location: { lat: number; lng: number }) => {
    setUserLocation(location)
  }

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  if (userLocation) {
    return <AppContent userLocation={userLocation} />
  }

  return (
    <LocationService onLocationUpdate={handleLocationUpdate}>
      <AppContent userLocation={userLocation} />
    </LocationService>
  )
}
