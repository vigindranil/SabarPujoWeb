"use client"

import { useState } from "react"
import { X, Star, Shield, Baby, Users, UserCheck, Car, Lock, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
  pandalId: number
  pandalName: string
}

const ratingCategories = [
  {
    key: "overallPublicSafety",
    title: "Overall Public Safety",
    icon: Shield,
    description: "General safety and security measures",
  },
  {
    key: "childFriendly",
    title: "Child Friendly",
    icon: Baby,
    description: "Safety and facilities for children",
  },
  {
    key: "womenFriendly",
    title: "Women Friendly",
    icon: Users,
    description: "Safety and comfort for women",
  },
  {
    key: "elderlyFriendly",
    title: "Elderly Friendly",
    icon: UserCheck,
    description: "Accessibility for elderly visitors",
  },
  {
    key: "safeDriveSaveLife",
    title: "Safe Drive Save Life Campaign",
    icon: Car,
    description: "Traffic safety measures",
  },
  {
    key: "cybersafePuja",
    title: "Cybersafe Puja",
    icon: Lock,
    description: "Digital safety and security",
  },
]

export function RatingModal({ isOpen, onClose, pandalId, pandalName }: RatingModalProps) {
  const [ratings, setRatings] = useState({
    overallPublicSafety: 0,
    childFriendly: 0,
    womenFriendly: 0,
    elderlyFriendly: 0,
    safeDriveSaveLife: 0,
    cybersafePuja: 0,
  })
  const [mobileNumber, setMobileNumber] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleRatingChange = (key: string, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }))
  }

  const submitRating = async () => {
    if (!mobileNumber || mobileNumber.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.")
      return
    }

    const hasAllRatings = Object.values(ratings).every((rating) => rating > 0)
    if (!hasAllRatings) {
      alert("Please provide ratings for all categories.")
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        pandal_id: pandalId,
        username: mobileNumber,
        overall_public_safety: ratings.overallPublicSafety,
        child_friendly: ratings.childFriendly,
        women_friendly: ratings.womenFriendly,
        elderly_friendly: ratings.elderlyFriendly,
        safedrive_savelife_campaign: ratings.safeDriveSaveLife,
        cybersafe_puja: ratings.cybersafePuja,
      }

      const response = await fetch("https://utsab.kolkatapolice.org/UtsavRestAPI/api/pujaPandal/savePandalRating", {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        alert("Thank you for your rating!")
        onClose()
        setRatings({
          overallPublicSafety: 0,
          childFriendly: 0,
          womenFriendly: 0,
          elderlyFriendly: 0,
          safeDriveSaveLife: 0,
          cybersafePuja: 0,
        })
        setMobileNumber("")
      } else {
        throw new Error(data.message || "Failed to submit rating")
      }
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setSubmitting(false)
    }
  }

  const StarRating = ({ value, onChange }: { value: number; onChange: (rating: number) => void }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} type="button" onClick={() => onChange(star)} className="focus:outline-none">
            <Star className={`w-6 h-6 ${star <= value ? "text-primary fill-primary" : "text-muted-foreground"}`} />
          </button>
        ))}
      </div>
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-xl font-bold text-foreground">Rate This Puja</h2>
              <p className="text-sm text-muted-foreground mt-1">Help improve the puja experience for everyone</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Mobile Number Input Section */}
          <div className="p-6 border-b bg-muted/30">
            <div className="space-y-2">
              <Label htmlFor="mobile" className="text-sm font-medium text-foreground">
                Mobile Number *
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="Enter your 10-digit mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="pl-10"
                  maxLength={10}
                />
              </div>
              <p className="text-xs text-muted-foreground">Your mobile number is required for rating submission</p>
            </div>
          </div>

          {/* Rating Categories */}
          <div className="p-6 space-y-6">
            {ratingCategories.map((category) => {
              const IconComponent = category.icon
              return (
                <div key={category.key} className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{category.title}</h4>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                  <div className="ml-13">
                    <StarRating
                      value={ratings[category.key as keyof typeof ratings]}
                      onChange={(rating) => handleRatingChange(category.key, rating)}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Submit Button */}
          <div className="p-6 border-t">
            <Button
              onClick={submitRating}
              disabled={submitting || !mobileNumber || mobileNumber.length !== 10}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Rating"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
