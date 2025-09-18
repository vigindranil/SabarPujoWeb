"use client"

import { useState, useEffect, useRef } from "react"
import {
  ArrowLeft,
  MapPin,
  Hospital,
  Shield,
  Train,
  Bus,
  Car,
  CreditCard,
  Fuel,
  Navigation,
  Search,
  Filter,
  Clock,
  Star,
  Phone,
  ExternalLink,
  Home,
  ImageIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

declare global {
  interface Window {
    google: any
    initGoogleMaps: () => void
  }
}

interface NearbyPageProps {
  onBack: () => void
  userLocation: { lat: number; lng: number } | null
  onShowHome?: () => void
  onShowEmergency?: () => void
  onShowGallery?: () => void
}

interface FacilityItem {
  id: number
  title: string
  description: string | null
  address: string | null
  latitude: number
  longitude: number
  distance: number
  rating: string
  timing: string | null
  contactNumber: string | null
  operationalStatus: string | null
}

interface NearbyData {
  counts: {
    total: number
    ps: number
    pandal: number
    metro: number
    medical: number
    payuse: number
    parking: number
    atm: number
    busstop: number
    petrolpump: number
  }
  data: {
    ps: FacilityItem[]
    pandal: FacilityItem[]
    metro: FacilityItem[]
    medical: FacilityItem[]
    payuse: FacilityItem[]
    parking: FacilityItem[]
    atm: FacilityItem[]
    busstop: FacilityItem[]
    petrolpump: FacilityItem[]
  }
}

const facilityConfig = {
  pandal: {
    name: "Pujo Pandals",
    icon: MapPin,
    gradient: "from-rose-500 to-pink-600",
    color: "#E11D48",
    bgGradient: "from-rose-50 to-pink-50",
    shadow: "shadow-rose-200/50",
  },
  atm: {
    name: "ATMs",
    icon: CreditCard,
    gradient: "from-cyan-500 to-blue-600",
    color: "#0891B2",
    bgGradient: "from-cyan-50 to-blue-50",
    shadow: "shadow-cyan-200/50",
  },
  medical: {
    name: "Medical Care",
    icon: Hospital,
    gradient: "from-emerald-500 to-teal-600",
    color: "#059669",
    bgGradient: "from-emerald-50 to-teal-50",
    shadow: "shadow-emerald-200/50",
  },
  ps: {
    name: "Police Help",
    icon: Shield,
    gradient: "from-blue-500 to-indigo-600",
    color: "#2563EB",
    bgGradient: "from-blue-50 to-indigo-50",
    shadow: "shadow-blue-200/50",
  },
  metro: {
    name: "Metro Stations",
    icon: Train,
    gradient: "from-purple-500 to-violet-600",
    color: "#7C3AED",
    bgGradient: "from-purple-50 to-violet-50",
    shadow: "shadow-purple-200/50",
  },
  busstop: {
    name: "Bus Stops",
    icon: Bus,
    gradient: "from-green-500 to-emerald-600",
    color: "#16A34A",
    bgGradient: "from-green-50 to-emerald-50",
    shadow: "shadow-green-200/50",
  },
  parking: {
    name: "Parking Areas",
    icon: Car,
    gradient: "from-orange-500 to-amber-600",
    color: "#EA580C",
    bgGradient: "from-orange-50 to-amber-50",
    shadow: "shadow-orange-200/50",
  },
  payuse: {
    name: "Public Toilets",
    icon: MapPin,
    gradient: "from-teal-500 to-cyan-600",
    color: "#0D9488",
    bgGradient: "from-teal-50 to-cyan-50",
    shadow: "shadow-teal-200/50",
  },
  petrolpump: {
    name: "Petrol Pumps",
    icon: Fuel,
    gradient: "from-amber-500 to-yellow-600",
    color: "#D97706",
    bgGradient: "from-amber-50 to-yellow-50",
    shadow: "shadow-amber-200/50",
  },
}

export function NearbyPage({ onBack, userLocation, onShowHome, onShowEmergency, onShowGallery }: NearbyPageProps) {
  const [nearbyData, setNearbyData] = useState<NearbyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [mapLoaded, setMapLoaded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    if (userLocation) {
      fetchNearbyData()
    }
  }, [userLocation])

  const fetchNearbyData = async () => {
    if (!userLocation) return

    try {
      setLoading(true)
      const response = await fetch(
        "https://utsab.kolkatapolice.org/UtsavRestAPI/api/pujaPandal/getNearbyPandalsAndFacilities",
        {
          method: "POST",
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            latitude: userLocation.lat.toString(),
            longitude: userLocation.lng.toString(),
          }),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to fetch nearby data")
      }

      const result = await response.json()
      if (result.status === 0 && result.data) {
        setNearbyData(result.data)
      } else {
        throw new Error(result.message || "Failed to fetch data")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps && window.google.maps.Map) {
        setMapLoaded(true)
        return
      }

      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
      if (existingScript) {
        existingScript.remove()
      }

      const callbackName = `initGoogleMaps_${Date.now()}`

      window[callbackName as any] = () => {
        setTimeout(() => {
          if (window.google && window.google.maps && window.google.maps.Map) {
            setMapLoaded(true)
          } else {
            setError("Google Maps failed to initialize properly")
          }
        }, 100)
      }

      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCQqA3_8XJ9RkzPEtj2tzGQLD4y4vjoRWw&libraries=geometry&loading=async&callback=${callbackName}`
      script.async = true
      script.defer = true

      script.onerror = () => {
        setError("Failed to load Google Maps")
      }

      document.head.appendChild(script)
    }

    loadGoogleMaps()
  }, [])

  useEffect(() => {
    if (mapLoaded && nearbyData && userLocation && mapRef.current) {
      initializeMap()
    }
  }, [mapLoaded, nearbyData, userLocation])

  const openInMaps = (latitude: number, longitude: number, title: string) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&destination_place_id=${encodeURIComponent(title)}`
    window.open(url, "_blank")
  }

  const getAllFacilities = () => {
    if (!nearbyData) return []

    const allFacilities: (FacilityItem & { type: string })[] = []

    Object.entries(nearbyData.data).forEach(([type, facilities]) => {
      facilities.forEach((facility) => {
        allFacilities.push({ ...facility, type })
      })
    })

    return allFacilities.sort((a, b) => a.distance - b.distance)
  }

  const getFilteredFacilities = () => {
    let facilities =
      selectedCategory === "all"
        ? getAllFacilities()
        : nearbyData?.data[selectedCategory as keyof typeof nearbyData.data]?.map((facility) => ({
            ...facility,
            type: selectedCategory,
          })) || []

    if (searchQuery.trim()) {
      facilities = facilities.filter(
        (facility) =>
          facility.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (facility.description && facility.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (facility.address && facility.address.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    return facilities
  }

  const initializeMap = () => {
    if (!mapRef.current || !userLocation || !nearbyData) return

    try {
      if (!window.google || !window.google.maps || !window.google.maps.Map) {
        setError("Google Maps API not ready")
        return
      }

      if (mapInstanceRef.current) {
        mapInstanceRef.current = null
      }

      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: userLocation.lat, lng: userLocation.lng },
        zoom: 14,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        gestureHandling: "cooperative",
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "transit",
            elementType: "labels",
            stylers: [{ visibility: "simplified" }],
          },
        ],
      })

      try {
        if (window.google.maps.TrafficLayer) {
          const trafficLayer = new window.google.maps.TrafficLayer()
          trafficLayer.setMap(map)
        }
      } catch (trafficError) {
        console.warn("Could not add traffic layer:", trafficError)
      }

      mapInstanceRef.current = map

      markersRef.current.forEach((marker) => {
        try {
          marker.setMap(null)
        } catch (e) {
          console.warn("Error clearing marker:", e)
        }
      })
      markersRef.current = []

      try {
        const userMarker = new window.google.maps.Marker({
          position: { lat: userLocation.lat, lng: userLocation.lng },
          map: map,
          title: "Your Location",
          icon: {
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="14" fill="#3B82F6" stroke="white" strokeWidth="3"/>
                  <circle cx="16" cy="16" r="6" fill="white"/>
                  <circle cx="16" cy="16" r="2" fill="#3B82F6"/>
                </svg>
              `),
            scaledSize: new window.google.maps.Size(32, 32),
          },
        })
        markersRef.current.push(userMarker)
      } catch (markerError) {
        console.error("Error creating user marker:", markerError)
      }

      const allFacilities = getAllFacilities()

      allFacilities.forEach((facility) => {
        try {
          const config = facilityConfig[facility.type as keyof typeof facilityConfig]

          const marker = new window.google.maps.Marker({
            position: { lat: facility.latitude, lng: facility.longitude },
            map: map,
            title: facility.title,
            icon: {
              url:
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(`
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="18" cy="18" r="15" fill="${config?.color || "#64748B"}" stroke="white" strokeWidth="3"/>
                    <circle cx="18" cy="18" r="8" fill="white"/>
                  </svg>
                `),
              scaledSize: new window.google.maps.Size(36, 36),
            },
          })

          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 12px; max-width: 250px; font-family: system-ui;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1e293b;">${facility.title}</h3>
                ${facility.description ? `<p style="margin: 0 0 8px 0; font-size: 14px; color: #475569; line-height: 1.4;">${facility.description}</p>` : ""}
                ${facility.address ? `<p style="margin: 0 0 12px 0; font-size: 12px; color: #64748b; line-height: 1.3;">${facility.address}</p>` : ""}
                <div style="display: flex; gap: 6px; margin-bottom: 12px; flex-wrap: wrap;">
                  <span style="background: linear-gradient(135deg, #f1f5f9, #e2e8f0); padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 500; color: #475569;">${facility.distance}m away</span>
                  ${facility.timing ? `<span style="background: linear-gradient(135deg, #fef3c7, #fde68a); padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 500; color: #92400e;">${facility.timing}</span>` : ""}
                </div>
                <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}', '_blank')" 
                        style="background: linear-gradient(135deg, #3B82F6, #2563EB); color: white; border: none; padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 500; cursor: pointer; box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3); transition: all 0.2s;">
                  🧭 Navigate
                </button>
              </div>
            `,
          })

          marker.addListener("click", () => {
            infoWindow.open(map, marker)
          })

          markersRef.current.push(marker)
        } catch (facilityMarkerError) {
          console.error("Error creating facility marker:", facilityMarkerError)
        }
      })
    } catch (error) {
      console.error("Error initializing map:", error)
      setError("Failed to initialize map. Please try refreshing the page.")
    }
  }

  const handleHomeClick = () => {
    if (onShowHome) {
      onShowHome()
    }
  }

  const handleEmergencyCall = () => {
    if (onShowEmergency) {
      onShowEmergency()
    }
  }

  const handleGalleryClick = () => {
    if (onShowGallery) {
      onShowGallery()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative">
              <img
                src="/traditional-diya-oil-lamp-icon.jpg"
                alt="Diya lamp"
                className="w-16 h-16 mx-auto mb-6 animate-pulse"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400 to-purple-600 opacity-20 animate-pulse"></div>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Discovering Nearby Facilities</h3>
            <p className="text-slate-600 animate-pulse">Finding the best places around you...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <ExternalLink className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Connection Issue</h3>
            <p className="text-slate-600 mb-6">{error}</p>
            <Button
              onClick={fetchNearbyData}
              className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const filteredFacilities = getFilteredFacilities()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="flex items-center gap-3 p-3 md:gap-4 md:p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200 rounded-xl flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent truncate">
              Nearby Facilities
            </h1>
            <p className="text-xs md:text-sm text-slate-600 font-medium">
              {nearbyData?.counts.total || 0} facilities discovered around you
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border-0 text-xs"
            >
              Live Data
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-76px)] md:h-[calc(100vh-88px)]">
        <div className="w-full lg:w-1/2 h-64 lg:h-full border-b lg:border-b-0 lg:border-r border-slate-200/60 order-2 lg:order-1">
          <div className="h-full relative overflow-hidden">
            {mapLoaded ? (
              <div ref={mapRef} className="w-full h-full lg:rounded-l-xl" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                <div className="text-center">
                  <div className="relative mb-4">
                    <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-4 border-slate-300 border-t-indigo-600 mx-auto"></div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400 to-purple-600 opacity-10 animate-pulse"></div>
                  </div>
                  <p className="text-slate-700 font-medium text-sm md:text-base">Loading interactive map...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col bg-gradient-to-b from-white to-slate-50/50 order-1 lg:order-2">
          <div className="p-3 md:p-6 border-b border-slate-200/60 bg-white/50 backdrop-blur-sm">
            <div className="relative mb-3 md:mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search facilities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 md:py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-slate-900 placeholder-slate-500 text-sm md:text-base"
              />
            </div>

            <div className="flex gap-1 md:gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
                className={`whitespace-nowrap transition-all duration-200 text-xs md:text-sm px-2 md:px-3 py-1 md:py-2 flex-shrink-0 ${
                  selectedCategory === "all"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg border-0"
                    : "bg-white hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 border-slate-300 text-slate-700"
                }`}
              >
                <Filter className="h-3 w-3 mr-1" />
                All ({nearbyData?.counts.total || 0})
              </Button>
              {Object.entries(facilityConfig).map(([key, config]) => {
                const count = nearbyData?.counts[key as keyof typeof nearbyData.counts] || 0
                if (count === 0) return null

                const IconComponent = config.icon
                return (
                  <Button
                    key={key}
                    variant={selectedCategory === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(key)}
                    className={`whitespace-nowrap flex items-center gap-1 transition-all duration-200 text-xs md:text-sm px-2 md:px-3 py-1 md:py-2 flex-shrink-0 ${
                      selectedCategory === key
                        ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg ${config.shadow} border-0`
                        : "bg-white hover:bg-slate-50 hover:border-slate-400 border-slate-300 text-slate-700"
                    }`}
                  >
                    <IconComponent className="h-3 w-3" />
                    <span className="hidden sm:inline">{config.name}</span>
                    <span className="sm:hidden">{config.name.split(" ")[0]}</span>({count})
                  </Button>
                )
              })}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4">
            {filteredFacilities.length === 0 ? (
              <div className="text-center py-8 md:py-12">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 md:w-8 md:h-8 text-slate-500" />
                </div>
                <h3 className="text-base md:text-lg font-semibold text-slate-700 mb-2">No facilities found</h3>
                <p className="text-slate-500 text-sm md:text-base">Try adjusting your search or category filter</p>
              </div>
            ) : (
              filteredFacilities.map((facility) => {
                const config = facilityConfig[facility.type as keyof typeof facilityConfig]
                const IconComponent = config?.icon || MapPin

                return (
                  <Card
                    key={`${facility.type}-${facility.id}`}
                    className={`overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-r ${config?.bgGradient || "from-slate-50 to-slate-100"} hover:-translate-y-1 ${config?.shadow || "shadow-slate-200/50"}`}
                  >
                    <CardContent className="p-3 md:p-5">
                      <div className="flex items-start gap-3 md:gap-4">
                        <div
                          className={`p-2 md:p-3 rounded-xl flex-shrink-0 bg-gradient-to-r ${config?.gradient || "from-slate-400 to-slate-500"} shadow-md`}
                        >
                          <IconComponent className="h-4 w-4 md:h-6 md:w-6 text-white" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 md:gap-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-slate-900 text-sm md:text-base leading-tight mb-1">
                                {facility.title}
                              </h3>
                              {facility.description && (
                                <p className="text-xs md:text-sm text-slate-600 mb-2 leading-relaxed line-clamp-2">
                                  {facility.description}
                                </p>
                              )}
                              {facility.address && (
                                <p className="text-xs text-slate-500 mb-2 md:mb-3 line-clamp-2 leading-relaxed">
                                  📍 {facility.address}
                                </p>
                              )}

                              <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-3 flex-wrap">
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 border-0"
                                >
                                  📍 {facility.distance}m away
                                </Badge>
                                {facility.timing && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200 text-amber-800"
                                  >
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span className="hidden sm:inline">{facility.timing}</span>
                                    <span className="sm:hidden">Open</span>
                                  </Badge>
                                )}
                                {facility.rating && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs bg-gradient-to-r from-green-50 to-green-100 border-green-200 text-green-800"
                                  >
                                    <Star className="h-3 w-3 mr-1" />
                                    {facility.rating}
                                  </Badge>
                                )}
                              </div>

                              {facility.contactNumber && (
                                <div className="flex items-center gap-1 text-xs text-slate-600 mb-2">
                                  <Phone className="h-3 w-3 flex-shrink-0" />
                                  <span className="truncate">{facility.contactNumber}</span>
                                </div>
                              )}
                            </div>

                            <Button
                              size="sm"
                              onClick={() => openInMaps(facility.latitude, facility.longitude, facility.title)}
                              className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 text-xs md:text-sm px-2 md:px-3 py-1 md:py-2"
                            >
                              <Navigation className="h-3 w-3 mr-1 text-white" />
                              <span className="hidden sm:inline text-white">Navigate</span>
                              <span className="sm:hidden text-white">Go</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200/50 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-purple-50/30 to-amber-50/50"></div>
        <div className="relative flex items-center justify-around py-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex flex-col items-center py-2 text-slate-600 hover:bg-slate-50 rounded-2xl px-4"
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
                <img src="/icon.png" alt="Diya" className="w-8 h-8 object-contain" />
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
            className="flex flex-col items-center py-2 text-indigo-600 hover:bg-indigo-50 rounded-2xl px-4"
          >
            <Navigation className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Near By</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
