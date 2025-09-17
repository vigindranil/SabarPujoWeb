"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Download, Share2, X, Grid3x3, ImageIcon } from "lucide-react"
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
  onBack: () => void
}

export function GalleryPage({ onBack }: GalleryPageProps) {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

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
    </div>
  )
}
