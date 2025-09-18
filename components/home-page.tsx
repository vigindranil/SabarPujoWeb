"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, ImageIcon, Phone, Shield, Home, Navigation, Sparkles, Calendar, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FeedbackModal } from "@/components/feedback-modal"
import { fetchPujaPandals, getNearestPandals, getAllPandalsWithDistance } from "@/lib/api"
import type { PujaPandalListItem } from "@/lib/api"

interface HomePageProps {
  userLocation: { lat: number; lng: number } | null
  onPandalSelect: (id: number) => void
  onShowSearch: () => void
  onShowEmergency: () => void
  onShowNearby: () => void
  onShowGallery: () => void
}

export function HomePage({
  userLocation,
  onPandalSelect,
  onShowSearch,
  onShowEmergency,
  onShowNearby,
  onShowGallery,
}: HomePageProps) {
  const [showFeedback, setShowFeedback] = useState(false)
  const [allPandals, setAllPandals] = useState<(PujaPandalListItem & { distance: number })[]>([])
  const [filteredPandals, setFilteredPandals] = useState<(PujaPandalListItem & { distance: number })[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    fetchAllPandals()
  }, [userLocation])

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPandals(allPandals.slice(0, 10))
      setIsSearching(false)
    } else {
      setIsSearching(true)
      const filtered = allPandals.filter((pandal) => {
        const query = searchQuery.toLowerCase()
        const communityName = pandal.community_name?.toLowerCase() || ""
        const theme = pandal.theme?.toLowerCase() || ""
        const address = pandal.address?.toLowerCase() || ""

        return communityName.includes(query) || theme.includes(query) || address.includes(query)
      })
      setFilteredPandals(filtered.slice(0, 10))
    }
  }, [searchQuery, allPandals])

  const fetchAllPandals = async () => {
    try {
      setIsLoading(true)
      const allPandalData = await fetchPujaPandals()

      let pandalWithDistance
      if (userLocation) {
        // If location is available, sort by nearest
        pandalWithDistance = getNearestPandals(allPandalData, userLocation.lat, userLocation.lng, 50)
        console.log(" Showing nearest pandals based on location")
      } else {
        // If no location, show all pandals with distance 0
        pandalWithDistance = getAllPandalsWithDistance(allPandalData)
        console.log(" Showing all pandals (no location available)")
      }

      setAllPandals(pandalWithDistance)
      setFilteredPandals(pandalWithDistance.slice(0, 10))
    } catch (error) {
      console.error("Error fetching pandals:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Search is already handled by useEffect
      return
    }
    onShowSearch()
  }

  const handleClearSearch = () => {
    setSearchQuery("")
  }

  const handleEmergencyCall = () => {
    onShowEmergency()
  }

  const handleNearbyClick = () => {
    onShowNearby()
  }

  const handleGalleryClick = () => {
    onShowGallery()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header Section */}
      <div className="relative px-4 pt-12 pb-8 overflow-hidden">
        {/* Premium Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 via-yellow-300/10 to-orange-400/20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, rgba(251, 191, 36, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 40% 80%, rgba(168, 85, 247, 0.08) 0%, transparent 50%)`,
            }}
          />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-8 right-8 w-20 h-20 border-2 border-amber-300 rounded-full animate-pulse shadow-lg"></div>
          <div className="absolute bottom-12 left-6 w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce"></div>
          <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
          <div
            className="absolute top-2/3 left-1/3 w-8 h-8 border border-purple-300 rounded-full animate-spin"
            style={{ animationDuration: "8s" }}
          ></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              {/* Premium Diya Icon */}
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-300 via-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-xl border border-white/30">
                  <div className="w-9 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full relative shadow-lg">
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-yellow-300 rounded-full shadow-sm"></div>
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-yellow-400/60 rounded-full blur-sm animate-pulse"></div>
                  </div>
                </div>
                <div className="absolute inset-0 w-14 h-14 bg-amber-400/30 rounded-2xl blur-lg animate-pulse"></div>
              </div>

              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent leading-tight">
                  Welcome to Sabar Pujo!
                </h1>
                <p className="text-slate-600 text-sm flex items-center mt-1">
                  <Sparkles className="w-4 h-4 mr-2 text-amber-500" />
                  Discover the divine celebrations of Bengal
                </p>
              </div>
            </div>
          </div>

          {/* Premium Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-white/60 rounded-2xl blur-sm"></div>
            <div className="relative bg-white/90 backdrop-blur-lg rounded-2xl border border-white/50 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-amber-500/5"></div>
              <div className="relative flex items-center">
                <Search className="absolute left-6 text-slate-400 w-5 h-5" />
                <Input
                  placeholder="Search Puja Pandal, Theme, or Location"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-14 pr-16 bg-transparent border-0 h-16 text-slate-700 placeholder:text-slate-400 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-6 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Live Updates Card */}
      <div className="px-4 -mt-4 mb-8 relative z-20">
        <Card className="bg-gradient-to-r from-amber-100 via-yellow-50 to-orange-100 border-0 shadow-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-200/50 via-transparent to-orange-200/50"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-blue-800 text-lg mb-1">Live Updates & Announcements</h3>
                <p className="text-blue-700 text-sm leading-relaxed">
                  Welcome to Durga Puja 2025! Experience the divine celebration with safety and joy. Stay tuned for live
                  updates. - West Bengal Police
                </p>
              </div>
              <div className="flex flex-col items-center space-y-1 flex-shrink-0">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
                <span className="text-xs text-green-600 font-medium">LIVE</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Action Grid */}
      <div className="px-4 mb-10">
        <div className="grid grid-cols-2 gap-5">
          <Button
            onClick={handleSearch}
            className="h-28 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-3xl flex flex-col items-center justify-center space-y-3 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-blue-400/20"
          >
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <span className="font-semibold text-white">Search</span>
          </Button>

          <Button
            onClick={handleGalleryClick}
            className="h-28 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-3xl flex flex-col items-center justify-center space-y-3 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-purple-400/20"
          >
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
            <span className="font-semibold text-white">Gallery</span>
          </Button>

          <Button
            onClick={handleEmergencyCall}
            className="h-28 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-3xl flex flex-col items-center justify-center space-y-3 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-red-400/20"
          >
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <span className="font-semibold text-white">Emergency</span>
          </Button>

          <Button className="h-28 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-3xl flex flex-col items-center justify-center space-y-3 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-emerald-400/20">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="font-semibold text-white">Cyber Safe</span>
          </Button>
        </div>
      </div>

      {/* Enhanced Featured Pandals Section */}
      <div className="px-4 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-700 to-slate-600 bg-clip-text text-transparent">
              {isSearching ? `Search Results` : userLocation ? "Featured Pandals" : "All Pandals"}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              <span className="inline-flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {isSearching
                  ? `${filteredPandals.length} pandals found`
                  : userLocation
                    ? `${filteredPandals.length} nearest pandals to you`
                    : `${filteredPandals.length} pandals available`}
              </span>
            </p>
          </div>
          {!isSearching && (
            <Button
              variant="ghost"
              onClick={onShowSearch}
              className="text-blue-600 font-semibold hover:bg-blue-50 hover:text-blue-700 rounded-xl px-6"
            >
              View All
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-100"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent absolute top-0"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        ) : filteredPandals.length === 0 && isSearching ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No Pandals Found</h3>
            <p className="text-slate-500 text-center mb-6">
              Try searching with different keywords like pandal name, theme, or location
            </p>
            <Button
              onClick={handleClearSearch}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl"
            >
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredPandals.map((pandal) => (
              <Card
                key={pandal.id}
                className="overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] bg-white/80 backdrop-blur-sm border-0 shadow-lg group"
                onClick={() => onPandalSelect(pandal.id)}
              >
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 flex-shrink-0 relative overflow-hidden">
                      <img
                        src={
                          pandal.image ||
                          "/placeholder.svg?height=128&width=128&query=Durga+Puja+pandal" ||
                          "/placeholder.svg"
                        }
                        alt={pandal.community_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                      <div className="absolute top-3 left-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-slate-800 mb-2 text-lg leading-tight group-hover:text-blue-600 transition-colors">
                          {searchQuery && pandal.community_name ? (
                            <span
                              dangerouslySetInnerHTML={{
                                __html: pandal.community_name.replace(
                                  new RegExp(`(${searchQuery})`, "gi"),
                                  '<mark class="bg-yellow-200 text-slate-800 px-1 rounded">$1</mark>',
                                ),
                              }}
                            />
                          ) : (
                            pandal.community_name || "Unknown Community"
                          )}
                        </h3>
                        <p className="text-sm text-slate-600 mb-3 leading-relaxed line-clamp-2">
                          {searchQuery && pandal.theme ? (
                            <span
                              dangerouslySetInnerHTML={{
                                __html: pandal.theme.replace(
                                  new RegExp(`(${searchQuery})`, "gi"),
                                  '<mark class="bg-yellow-200 text-slate-800 px-1 rounded">$1</mark>',
                                ),
                              }}
                            />
                          ) : (
                            pandal.theme || "No theme specified"
                          )}
                        </p>
                        <div className="flex items-center text-xs text-slate-500 mb-3">
                          <MapPin className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                          <span className="truncate">
                            {searchQuery && pandal.address ? (
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: pandal.address.replace(
                                    new RegExp(`(${searchQuery})`, "gi"),
                                    '<mark class="bg-yellow-200 text-slate-800 px-1 rounded">$1</mark>',
                                  ),
                                }}
                              />
                            ) : (
                              pandal.address || "Address not available"
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-blue-200 hover:from-blue-100 hover:to-purple-100 text-xs px-3 py-1 rounded-full">
                          {userLocation ? `${pandal.distance.toFixed(1)} km away` : "Distance N/A"}
                        </Badge>
                        <Heart className="w-5 h-5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Feedback Card */}
      <div className="px-4 mb-28">
        <Card
          className="bg-gradient-to-br from-indigo-500 via-purple-600 to-blue-700 border-0 cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] overflow-hidden relative group"
          onClick={() => setShowFeedback(true)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/5"></div>
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-4 right-4 w-32 h-32 border border-white/20 rounded-full"></div>
            <div className="absolute -bottom-8 -left-8 w-40 h-40 border border-white/10 rounded-full"></div>
          </div>
          <CardContent className="p-8 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-5">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-3xl flex items-center justify-center shadow-xl">
                  <div className="text-white text-2xl">💬</div>
                </div>
                <div>
                  <h3 className="font-bold text-white text-xl mb-1">Feedback & Suggestions</h3>
                  <p className="text-white/90 text-sm leading-relaxed">
                    Help us improve your festival experience and make it even better
                  </p>
                </div>
              </div>
              <div className="text-white/80 hover:text-white transition-colors group-hover:translate-x-1 transform duration-300">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200/50 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-purple-50/30 to-amber-50/50"></div>
        <div className="relative flex items-center justify-around py-4">
          <Button
            variant="ghost"
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
            <ImageIcon className="w-6 h-6 mb-1" />
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

      <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} />
    </div>
  )
}
