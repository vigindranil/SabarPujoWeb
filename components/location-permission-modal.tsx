"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, X } from "lucide-react"

interface LocationPermissionModalProps {
  isOpen: boolean
  onRequestLocation: () => void
  onClose: () => void
}

export function LocationPermissionModal({ isOpen, onRequestLocation, onClose }: LocationPermissionModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl border-0 overflow-hidden">
        <CardContent className="p-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-orange-600/20"></div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Location Access Required</h2>
                <p className="text-white/90 text-sm">Enable location to find nearby pujas</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Cannot show the puja near you</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Please allow location access to discover Durga Puja pandals in your area. Without location, we'll show
                all available pujas instead.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={onRequestLocation}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Allow Location Access
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="w-full border-slate-300 text-slate-600 hover:bg-slate-50 py-3 rounded-xl bg-transparent"
              >
                Continue Without Location
              </Button>
            </div>

            {/* Info */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700 text-center">
                🔒 Your location data is only used to find nearby pandals and is not stored or shared.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
