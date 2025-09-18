"use client"
import { useState, useEffect } from "react"
import { ArrowLeft, Download, Share2, X, Grid3x3, ImageIcon,Home,Phone,Image,Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface GalleryImage {
  id: string
  title: string
  source: string
  image: string
  likes: number
  isLiked: boolean
}

interface GalleryPageProps {
  onBack: () => void;
  onShowEmergency: () => void;
  onShowNearby: () => void;
  onShowGallery: () => void;

}

export function GalleryPage({ onBack,  onShowEmergency,
  onShowNearby,
  onShowGallery }: GalleryPageProps) {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")



  const handleEmergencyCall = () => {
    onShowEmergency();
  };
 
  const handleNearbyClick = () => {
    onShowNearby();
  };

  const handleGalleryClick = () => {
    onShowGallery();
  };

  const fetchGalleryImages = async () => {
    setLoading(true)
    setError(null)
    const url = "https://utsab.kolkatapolice.org/UtsavRestAPI/api/pujaPandal/getSpecialPujaDetails"

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", accept: "*/*" },
      })

      const result = await response.json()

      if (result.status === 0 && Array.isArray(result.data)) {
        const allImages: GalleryImage[] = []

        result.data.forEach((pandal: any) => {
          if (pandal.first_puja_image) {
            allImages.push({
              id: `${pandal.pandel_id}-1`,
              title: pandal.puja_name.trim(),
              source: pandal.puja_popular_name,
              image: pandal.first_puja_image,
              likes: Math.floor(Math.random() * 1500) + 200,
              isLiked: false,
            })
          }
          if (pandal.second_puja_image) {
            allImages.push({
              id: `${pandal.pandel_id}-2`,
              title: pandal.puja_name.trim(),
              source: pandal.puja_popular_name,
              image: pandal.second_puja_image,
              likes: Math.floor(Math.random() * 1500) + 200,
              isLiked: false,
            })
          }
          if (pandal.third_puja_image) {
            allImages.push({
              id: `${pandal.pandel_id}-3`,
              title: pandal.puja_name.trim(),
              source: pandal.puja_popular_name,
              image: pandal.third_puja_image,
              likes: Math.floor(Math.random() * 1500) + 200,
              isLiked: false,
            })
          }
        })

        setImages(allImages)
        console.log("Gallery images fetched and mapped:", allImages.length)
      } else {
        throw new Error(result.message || "Could not fetch gallery images.")
      }
    } catch (e: any) {
      console.error("Error fetching gallery:", e)
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGalleryImages()
  }, [])

  const toggleLike = (imageId: string) => {
    setImages((prevImages) =>
      prevImages.map((img) =>
        img.id === imageId
          ? { ...img, isLiked: !img.isLiked, likes: img.isLiked ? img.likes - 1 : img.likes + 1 }
          : img,
      ),
    )
  }

  const ImageCard = ({ image, isGrid = true }: { image: GalleryImage; isGrid?: boolean }) => (
    <div
      className={`cursor-pointer transition-transform hover:scale-105 ${
        isGrid
          ? "bg-white rounded-2xl overflow-hidden shadow-lg"
          : "bg-white rounded-2xl overflow-hidden shadow-lg mb-6"
      }`}
      onClick={() => setSelectedImage(image)}
    >
      <img
        src={image.image || "/placeholder.svg"}
        alt={image.title}
        className={isGrid ? "w-full h-48 object-cover" : "w-full h-64 object-cover"}
      />

      {!isGrid && (
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{image.title}</h3>
          <p className="text-sm text-gray-600 mb-4">📸 {image.source}</p>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="ghost" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
          <Button variant="ghost" size="sm" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
            {viewMode === "grid" ? <ImageIcon className="w-5 h-5" /> : <Grid3x3 className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-red-500 text-center">{error}</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Beautiful captures from Kolkata's finest pandals
              </h2>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 gap-4">
                {images.map((image) => (
                  <ImageCard key={image.id} image={image} isGrid={true} />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {images.map((image) => (
                  <ImageCard key={image.id} image={image} isGrid={false} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl w-full h-[90vh] p-0 bg-black">
          <div className="relative h-full flex flex-col">
            <div className="flex justify-end p-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedImage(null)}
                className="text-white hover:bg-white/20"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            {selectedImage && (
              <>
                <div className="flex-1 flex items-center justify-center p-4">
                  <img
                    src={selectedImage.image || "/placeholder.svg"}
                    alt={selectedImage.title}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="p-6 bg-black/80">
                  <h3 className="text-xl font-bold text-white mb-2">{selectedImage.title}</h3>
                  <p className="text-gray-300 mb-4">📸 {selectedImage.source}</p>
                  <div className="flex gap-4">
                    <Button variant="secondary" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="secondary" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
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
    </div>
  )
}
