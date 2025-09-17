"use client"

import type React from "react"

import { useState } from "react"
import { X, MessageCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { submitFeedback } from "@/lib/api"

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [phone, setPhone] = useState("")
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!phone || !feedback) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    // Validate phone number (should be numeric and reasonable length)
    const phoneNumber = Number.parseInt(phone.replace(/\D/g, ""))
    if (isNaN(phoneNumber) || phone.length < 10) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const success = await submitFeedback(phoneNumber, feedback)

      if (success) {
        toast({
          title: "Thank you!",
          description: "Your feedback has been submitted successfully. We appreciate your input!",
        })
        setPhone("")
        setFeedback("")
        onClose()
      } else {
        throw new Error("Failed to submit feedback")
      }
    } catch (error) {
      console.error("Feedback submission error:", error)
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setPhone("")
      setFeedback("")
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-lg">Feedback & Suggestions</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleClose} disabled={isSubmitting}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-6">Help us improve your experience with Sabar Pujo</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Phone Number *</label>
              <Input
                type="tel"
                placeholder="Enter your 10-digit phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full"
                maxLength={15}
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">We'll use this to follow up if needed</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Your Feedback *</label>
              <Textarea
                placeholder="Share your thoughts, suggestions, or report any issues with the app..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full min-h-[120px] resize-none"
                maxLength={500}
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1 text-right">{feedback.length}/500 characters</p>
            </div>
            <div className="flex space-x-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 bg-transparent"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !phone || !feedback}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Send className="w-4 h-4" />
                    <span>Submit</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
