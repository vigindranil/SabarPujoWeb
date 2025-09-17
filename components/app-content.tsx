"use client"

import { useState } from "react"
import { HomePage } from "@/components/home-page"
import { SearchPage } from "@/components/search-page"
import { PandalDetails } from "@/components/pandal-details"
import { EmergencyPage } from "@/components/emergency-page"
import { NearbyPage } from "@/components/nearby-page"
import { GalleryPage } from "@/components/gallery-page"

interface AppContentProps {
  userLocation: { lat: number; lng: number } | null
}

export function AppContent({ userLocation }: AppContentProps) {
  const [currentPage, setCurrentPage] = useState<"home" | "search" | "details" | "emergency" | "nearby" | "gallery">(
    "home",
  )
  const [selectedPandal, setSelectedPandal] = useState<number | null>(null)

  const handlePandalClick = (pandalId: number) => {
    setSelectedPandal(pandalId)
    setCurrentPage("details")
  }

  const handleBackToHome = () => {
    setCurrentPage("home")
    setSelectedPandal(null)
  }

  const handleShowSearch = () => {
    setCurrentPage("search")
  }

  const handleBackToSearch = () => {
    setCurrentPage("search")
  }

  const handleShowEmergency = () => {
    setCurrentPage("emergency")
  }

  const handleShowNearby = () => {
    setCurrentPage("nearby")
  }

  const handleShowGallery = () => {
    setCurrentPage("gallery")
  }

  if (currentPage === "gallery") {
    return <GalleryPage onBack={handleBackToHome} />
  }

  if (currentPage === "nearby") {
    return <NearbyPage onBack={handleBackToHome} userLocation={userLocation} />
  }

  if (currentPage === "emergency") {
    return <EmergencyPage onBack={handleBackToHome} />
  }

  if (currentPage === "search") {
    return <SearchPage onBack={handleBackToHome} onPandalSelect={handlePandalClick} userLocation={userLocation} />
  }

  if (currentPage === "details" && selectedPandal) {
    return <PandalDetails pandalId={selectedPandal} userLocation={userLocation} onBack={handleBackToSearch} />
  }

  return (
    <HomePage
      userLocation={userLocation}
      onPandalSelect={handlePandalClick}
      onShowSearch={handleShowSearch}
      onShowEmergency={handleShowEmergency}
      onShowNearby={handleShowNearby}
      onShowGallery={handleShowGallery}
    />
  )
}
