"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation" 
import { SplashScreen } from "@/components/splash-screen"
import { LocationService } from "@/components/location-service"
import { AppContent } from "@/components/app-content"

function PageContent() {
  const [showSplash, setShowSplash] = useState(true)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  const searchParams = useSearchParams()

  useEffect(() => {
    const latParam = searchParams.get("lat")
    const lngParam = searchParams.get("lng")

    if (latParam && lngParam) {
      const lat = parseFloat(latParam)
      const lng = parseFloat(lngParam)
      if (!isNaN(lat) && !isNaN(lng)) {
        console.log("📍 Location set from URL parameters:", { lat, lng })
        setUserLocation({ lat, lng })
      }
    }
  }, [searchParams])

  const handleSplashComplete = () => setShowSplash(false)
  const handleLocationUpdate = (location: { lat: number; lng: number }) => setUserLocation(location)

  if (showSplash) return <SplashScreen onComplete={handleSplashComplete} />

  if (userLocation) return <AppContent userLocation={userLocation} />

  return (
    <LocationService onLocationUpdate={handleLocationUpdate}>
      <AppContent userLocation={userLocation} />
    </LocationService>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  )
}
