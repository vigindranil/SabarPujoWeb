"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Heart,
  Share,
  MapPin,
  Clock,
  Phone,
  Star,
  Navigation,
  Bus,
  Train,
  Shield,
  Users,
  Flame,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RatingModal } from "./rating-modal"

interface PandalDetailsData {
  id: number
  name: string
  theme: string
  images: string[]
  description: string
  address: string
  phone: string
  distance: string
  timings: string
  emergencyServices: {
    medical: boolean
    police: boolean
    fire: boolean
    ctv_surveillance: boolean
    fire_brigade: boolean
    police_control_room: boolean
    ambulance: boolean
  }
  transport: Array<{
    type: string
    name: string
    distance: string
    latitude: string
    longitude: string
  }>
  specialFeatures: string[]
}

interface PandalDetailsProps {
  pandalId: number
  userLocation: { lat: number; lng: number } | null
  onBack: () => void
}

export function PandalDetails({ pandalId, userLocation, onBack }: PandalDetailsProps) {
  const [pandalData, setPandalData] = useState<PandalDetailsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false)

  useEffect(() => {
    fetchPandalDetails()
  }, [pandalId, userLocation])

  const fetchPandalDetails = async () => {
    if (!userLocation) return

    try {
      const response = await fetch("https://utsab.kolkatapolice.org/UtsavRestAPI/api/pujaPandal/getPujaPandalDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pandal_id: pandalId,
          latitude: userLocation.lat.toString(),
          longitude: userLocation.lng.toString(),
        }),
      })

      const data = await response.json()
      if (data.status === 0 && data.data && data.data.length > 0) {
        setPandalData(data.data[0])
      }
    } catch (error) {
      console.error("Error fetching pandal details:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCall = () => {
    if (pandalData?.phone) {
      window.location.href = `tel:${pandalData.phone}`
    }
  }

  const handleGetDirections = () => {
    if (pandalData && userLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${pandalData.address}`
      window.open(url, "_blank")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!pandalData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Failed to load pandal details</p>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative">
        <div className="h-80 bg-muted relative overflow-hidden">
          <img
            src={
              pandalData.images[currentImageIndex] ||
              "/placeholder.svg?height=320&width=400&query=Durga+Puja+pandal+detailed+view" ||
              "/placeholder.svg" ||
              "/placeholder.svg"
            }
            alt={pandalData.name}
            className="w-full h-full object-cover"
          />

          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Navigation Buttons */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="absolute top-4 left-4 bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="absolute top-4 right-4 flex space-x-2">
            <Button variant="ghost" size="sm" className="bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm">
              <Heart className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm">
              <Share className="w-5 h-5" />
            </Button>
          </div>

          {/* Hero content overlay */}
          <div className="absolute bottom-6 left-4 right-4 text-white">
            <h1 className="text-3xl font-bold mb-2 text-balance">{pandalData.name}</h1>
            <Badge variant="secondary" className="mb-2 bg-primary text-primary-foreground">
              {pandalData.theme}
            </Badge>
            <p className="text-white/90 text-sm flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {Number.parseFloat(pandalData.distance).toFixed(1)} km away
            </p>
          </div>

          {/* Image Indicators */}
          {pandalData.images.length > 1 && (
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {pandalData.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex ? "bg-white w-6" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-4 py-6 space-y-6 pb-24">
        {/* Quick Actions */}
        <div className="flex space-x-3">
          <Button
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
            onClick={() => setIsRatingModalOpen(true)}
          >
            <Star className="w-4 h-4 mr-2" />
            Rate This Pandal
          </Button>
        </div>

        {/* About Section */}
        <Card className="shadow-sm border-border/50">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
              <div className="w-1 h-6 bg-primary rounded-full mr-3" />
              About This Pandal
            </h2>
            <p className="text-muted-foreground leading-relaxed">{pandalData.description}</p>
          </CardContent>
        </Card>

        {/* Location & Contact Info */}
        <Card className="shadow-sm border-border/50">
          <CardContent className="p-6 space-y-6">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
              <div className="w-1 h-6 bg-primary rounded-full mr-3" />
              Location & Contact
            </h2>

            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">Address</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{pandalData.address}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-secondary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">Timings</h3>
                  <p className="text-muted-foreground text-sm">{pandalData.timings}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">Contact</h3>
                  <p className="text-accent font-semibold text-sm">{pandalData.phone}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Services */}
        <Card className="shadow-sm border-border/50">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
              <div className="w-1 h-6 bg-primary rounded-full mr-3" />
              Emergency Services
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div
                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                  pandalData.emergencyServices.medical
                    ? "border-green-200 bg-green-50 shadow-sm"
                    : "border-border bg-muted/30"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                    pandalData.emergencyServices.medical ? "bg-green-500" : "bg-muted-foreground"
                  }`}
                >
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-foreground">Medical</span>
              </div>

              <div
                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                  pandalData.emergencyServices.police
                    ? "border-primary/20 bg-primary/5 shadow-sm"
                    : "border-border bg-muted/30"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                    pandalData.emergencyServices.police ? "bg-primary" : "bg-muted-foreground"
                  }`}
                >
                  <Users className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-foreground">Police</span>
              </div>

              <div
                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                  pandalData.emergencyServices.fire
                    ? "border-orange-200 bg-orange-50 shadow-sm"
                    : "border-border bg-muted/30"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                    pandalData.emergencyServices.fire ? "bg-orange-500" : "bg-muted-foreground"
                  }`}
                >
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-foreground">Fire</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nearby Transport */}
        <Card className="shadow-sm border-border/50">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
              <div className="w-1 h-6 bg-primary rounded-full mr-3" />
              Nearby Transport
            </h2>
            <div className="space-y-3">
              {pandalData.transport.map((transport, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 bg-muted/50 rounded-xl hover:bg-muted/70 transition-colors"
                >
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                    {transport.type === "Metro" ? (
                      <Train className="w-6 h-6 text-primary-foreground" />
                    ) : (
                      <Bus className="w-6 h-6 text-primary-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{transport.type}</h3>
                    <p className="text-muted-foreground text-sm">{transport.name}</p>
                    <p className="text-primary text-sm font-medium">{transport.distance} km away</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                    <Navigation className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Special Features */}
        {pandalData.specialFeatures.length > 0 && (
          <Card className="shadow-sm border-border/50">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
                <div className="w-1 h-6 bg-primary rounded-full mr-3" />
                Special Features
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {pandalData.specialFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            onClick={handleGetDirections}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Get Directions
          </Button>
          <Button
            onClick={handleCall}
            variant="outline"
            className="flex-1 border-secondary text-secondary hover:bg-secondary/10 shadow-lg bg-transparent"
          >
            <Phone className="w-4 h-4 mr-2" />
            Call
          </Button>
        </div>
      </div>

      {/* Rating Modal */}
      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        pandalId={pandalData?.id || 0}
        pandalName={pandalData?.name || ""}
      />
    </div>
  )
}
