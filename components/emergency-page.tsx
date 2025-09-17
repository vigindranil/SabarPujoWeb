"use client"

import { ArrowLeft, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

// Import the helpline data
const helplineNumbers = [
  {
    id: 1,
    title: "Police",
    subtitle: "Dial 100",
    number: "100",
    gradient: ["#3B82F6", "#2563EB"],
    description: "24/7 Response",
  },
  {
    id: 2,
    title: "Traffic Helpline",
    subtitle: "Traffic Control Room",
    number: "1073",
    gradient: ["#F59E0B", "#D97706"],
    description: "Traffic related issues and assistance",
  },
  {
    id: 3,
    title: "Missing Person Helpline",
    subtitle: "Report Missing Persons",
    number: "9163737373",
    gradient: ["#8B5CF6", "#7C3AED"],
    description: "Report missing persons directly to authorities",
  },
  {
    id: 4,
    title: "Cyber Crime",
    subtitle: "Cyber Crime Helpline",
    number: "1930",
    gradient: ["#06B6D4", "#0891B2"],
    description: "Report cyber crimes and fraud",
  },
  {
    id: 5,
    title: "Fire Brigade",
    subtitle: "Fire Emergency",
    number: "101",
    gradient: ["#EF4444", "#DC2626"],
    description: "Fire emergency services",
  },
  {
    id: 7,
    title: "Women Helpline",
    subtitle: "Women Safety",
    number: "1091",
    gradient: ["#EC4899", "#DB2777"],
    description: "Women safety and assistance",
  },
  {
    id: 8,
    title: "Child Helpline",
    subtitle: "Child Protection, DCPO Kolkata & 24 Pgs(s) Helpline",
    number: "1098",
    gradient: ["#10B981", "#059669"],
    description: "Child protection and assistance",
  },
]

interface EmergencyPageProps {
  onBack: () => void
}

export function EmergencyPage({ onBack }: EmergencyPageProps) {
  const handleCall = (number: string) => {
    // Remove any extra characters and use the first number if multiple numbers exist
    const cleanNumber = number.split("||")[0].trim().replace(/[^\d]/g, "")
    window.location.href = `tel:${cleanNumber}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20 p-2">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Emergency Services</h1>
            <p className="text-blue-100 text-sm">24/7 Helpline Numbers</p>
          </div>
        </div>
      </div>

      {/* Emergency Cards */}
      <div className="p-4 space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Need Help?</h2>
          <p className="text-gray-600">Tap to call emergency services instantly</p>
        </div>

        {helplineNumbers.map((helpline) => (
          <div
            key={helpline.id}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div
              className="h-2"
              style={{
                background: `linear-gradient(90deg, ${helpline.gradient[0]}, ${helpline.gradient[1]})`,
              }}
            />

            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{helpline.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{helpline.subtitle}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{helpline.description}</p>

                  {/* Phone Number Display */}
                  <div className="mt-3 flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" />
                    <span className="text-lg font-mono font-semibold text-gray-700">{helpline.number}</span>
                  </div>
                </div>

                {/* Call Button */}
                <Button
                  onClick={() => handleCall(helpline.number)}
                  className="ml-4 px-6 py-3 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${helpline.gradient[0]}, ${helpline.gradient[1]})`,
                  }}
                >
                  <Phone size={18} className="mr-2" />
                  Call Now
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* Important Notice */}
        <div className="bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200 rounded-2xl p-6 mt-8">
          <div className="text-center">
            <h3 className="text-lg font-bold text-amber-800 mb-2">Important Notice</h3>
            <p className="text-amber-700 text-sm leading-relaxed">
              These are official emergency helpline numbers. Use them responsibly and only in genuine emergencies. All
              calls are monitored and recorded for quality and security purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
