"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Search, Filter, MapPin, Star, Clock,ImageIcon,Home,Phone,Image,Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PujaPandal {
  id: number
  community_name: string
  popular_name: string
  address: string
  theme: string
  image: string
  latitude: number
  longitude: number
  distance?: number
}

interface SearchPageProps {
  onBack: () => void;
  onShowEmergency: () => void;
  onShowNearby: () => void;
  onShowGallery: () => void;
  onPandalSelect: (id: number) => void
  userLocation: { lat: number; lng: number } | null
}

export function SearchPage({ onBack, onShowEmergency,
  onShowNearby,
  onShowGallery, onPandalSelect, userLocation }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [allPandals, setAllPandals] = useState<PujaPandal[]>([])
  const [filteredPandals, setFilteredPandals] = useState<PujaPandal[]>([])
  const [isLoading, setIsLoading] = useState(true)


  const handleEmergencyCall = () => {
    onShowEmergency();
  };
 
  const handleNearbyClick = () => {
    onShowNearby();
  };

  const handleGalleryClick = () => {
    onShowGallery();
  };

  useEffect(() => {
    fetchAllPandals()
  }, [])

  useEffect(() => {
    filterPandals()
  }, [searchQuery, allPandals])

  const fetchAllPandals = async () => {
    try {
      const response = await fetch("https://sabarpujo.wbapplication.link/WBUtsavRestAPI/api/pujaPandal/findPujaPandalDetailsByName", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ find_text: "" }),
      })

      const data = await response.json()
      if (data.status === 0 && data.data?.puja_pandal_details_lst) {
        const pandalsWithDistance = data.data.puja_pandal_details_lst.map((pandal: any) => ({
          ...pandal,
          distance: userLocation
            ? calculateDistance(userLocation.lat, userLocation.lng, pandal.latitude, pandal.longitude)
            : 0,
        }))

        setAllPandals(pandalsWithDistance)
        setFilteredPandals(pandalsWithDistance)
      }
    } catch (error) {
      console.error("Error fetching pandals:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371 // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const filterPandals = () => {
    if (!searchQuery.trim()) {
      setFilteredPandals(allPandals)
      return
    }

    const filtered = allPandals.filter(
      (pandal) =>
        (pandal.community_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (pandal.popular_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (pandal.address?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (pandal.theme?.toLowerCase() || "").includes(searchQuery.toLowerCase()),
    )

    setFilteredPandals(filtered)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-blue-100 px-4 py-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center space-x-4 mb-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2 hover:bg-blue-50">
            <ArrowLeft className="w-5 h-5 text-blue-600" />
          </Button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Search Pandals
          </h1>
        </div>

        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
            <Input
              placeholder="Search by name, theme, or location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-blue-200 rounded-xl h-12 shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="px-3 h-12 border-blue-200 bg-white hover:bg-blue-50 rounded-xl"
          >
            <Filter className="w-5 h-5 text-blue-600" />
          </Button>
        </div>
      </div>

      <div className="px-4 py-3 bg-white/80 backdrop-blur-sm border-b border-blue-100">
        <p className="text-sm text-blue-700 font-medium">
          {isLoading ? "Loading..." : `${filteredPandals.length} pandals found`}
        </p>
      </div>

      {/* Pandals List */}
      <div className="px-4 py-4 space-y-4 pb-20">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredPandals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-blue-600">No pandals found matching your search.</p>
          </div>
        ) : (
          filteredPandals.map((pandal) => (
            <Card
              key={pandal.id}
              className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 bg-white border-0 shadow-md hover:scale-[1.02] group"
              onClick={() => onPandalSelect(pandal.id)}
            >
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  {/* Image Section - Left side on desktop, top on mobile */}
                  <div className="relative w-full sm:w-32 md:w-40 lg:w-48 h-32 sm:h-full bg-gradient-to-br from-blue-100 to-yellow-100 overflow-hidden flex-shrink-0">
                    <img
                      src={pandal.image || "/placeholder.svg?height=128&width=192&query=Durga+Puja+pandal"}
                      alt={pandal.community_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                    {/* Distance Badge */}
                    {pandal.distance !== undefined && (
                      <Badge className="absolute top-2 right-2 bg-white/90 text-blue-700 border-0 shadow-sm text-xs">
                        <MapPin className="w-3 h-3 mr-1" />
                        {pandal.distance.toFixed(1)} km
                      </Badge>
                    )}
                  </div>

                  {/* Content Section - Right side on desktop, bottom on mobile */}
                  <div className="flex-1 p-3 sm:p-4">
                    {/* Title and Rating */}
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-base sm:text-lg text-blue-900 leading-tight group-hover:text-blue-700 transition-colors flex-1 pr-2">
                        {pandal.community_name}
                      </h3>
                      <div className="flex items-center flex-shrink-0">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">4.5</span>
                      </div>
                    </div>

                    {/* Popular Name */}
                    {pandal.popular_name && pandal.popular_name !== pandal.community_name && (
                      <p className="text-sm text-blue-600 font-medium mb-2">"{pandal.popular_name}"</p>
                    )}

                    {/* Theme */}
                    <div className="mb-2">
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-0 text-xs">
                        {pandal.theme || "Traditional Theme"}
                      </Badge>
                    </div>

                    {/* Address */}
                    <div className="flex items-start text-sm text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-blue-500" />
                      <span className="line-clamp-2 leading-relaxed">{pandal.address}</span>
                    </div>

                    {/* Bottom Section */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>Open 24/7</span>
                      </div>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 rounded-lg px-3 py-1 text-xs shadow-sm"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Bottom Navigation Spacer */}
         {/* Enhanced Bottom Navigation */}
         <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200/50 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-purple-50/30 to-amber-50/50"></div>
        <div className="relative flex items-center justify-around py-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex flex-col items-center py-2 text-blue-600 hover:bg-blue-50 rounded-2xl px-4"
          >
            <Home className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Home</span>
          </Button>

          <Button
            variant="ghost"
            onClick={handleEmergencyCall}
            className="flex flex-col items-center py-2 text-red-500 hover:bg-red-50 rounded-2xl px-4"
          >
            <Phone className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Emergency</span>
          </Button>

          {/* Premium Center Diya */}
          <div className="relative">
            {/* Main circular background with glow */}
            <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl border-4 border-white bg-gradient-to-br from-amber-300 via-yellow-400 to-orange-400">
              <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <img
                  src="/icon.png" // 🔹 replace with your diya image path
                  alt="Diya"
                  className="w-8 h-8 object-contain"
                />
              </div>
            </div>

            {/* Outer glow animation */}
            <div className="absolute inset-0 w-16 h-16 bg-amber-400/30 rounded-full blur-lg animate-pulse"></div>
          </div>

          <Button
            variant="ghost"
            onClick={handleGalleryClick}
            className="flex flex-col items-center py-2 text-slate-600 hover:bg-slate-50 rounded-2xl px-4"
          >
            <Image className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Gallery</span>
          </Button>

          <Button
            variant="ghost"
            onClick={handleNearbyClick}
            className="flex flex-col items-center py-2 text-slate-600 hover:bg-slate-50 rounded-2xl px-4"
          >
            <Navigation className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Near By</span>
          </Button>
        </div>
      </div>
      <div className="h-16"></div>
    </div>
  )
}
