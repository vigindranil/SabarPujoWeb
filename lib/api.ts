// API service for Puja Pandal data
const API_BASE_URL = "https://sabarpujo.wbapplication.link/WBUtsavRestAPI/api/pujaPandal"

export interface PujaPandalListItem {
  id: number
  division: string
  community_name: string
  popular_name: string
  address: string
  ps_name: string
  latitude: number
  longitude: number
  theme: string
  image: string
  queue_status: string | null
  wait_time: string | null
  is_nearby_kolkata_puja: string
  is_special_puja: string
  pandel_exits_image: string
}

export interface PujaPandalDetails {
  id: number
  name: string
  theme: string
  images: string[]
  description: string
  address: string
  phone: string
  queueStatus: string | null
  waitTime: string | null
  queueLength: string | null
  distance: string
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
  timings: string
  specialFeatures: string[]
  pandel_exits_image: string
}

export interface ApiResponse<T> {
  version: string
  status: number
  message: string
  data: T
}

// Fetch all puja pandals or search by name
export async function fetchPujaPandals(searchText = ""): Promise<PujaPandalListItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/findPujaPandalDetailsByName`, {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        find_text: searchText,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: ApiResponse<{ puja_pandal_details_lst: PujaPandalListItem[] }> = await response.json()

    if (data.status !== 0) {
      throw new Error(data.message || "Failed to fetch pandals")
    }

    return data.data?.puja_pandal_details_lst || []
  } catch (error) {
    console.error("Error fetching puja pandals:", error)
    throw error
  }
}

// Fetch detailed information about a specific pandal
export async function fetchPandalDetails(
  pandalId: number,
  userLatitude: number,
  userLongitude: number,
): Promise<PujaPandalDetails | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/getPujaPandalDetails`, {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pandal_id: pandalId,
        latitude: userLatitude.toString(),
        longitude: userLongitude.toString(),
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: ApiResponse<PujaPandalDetails[]> = await response.json()

    if (data.status !== 0) {
      throw new Error(data.message || "Failed to fetch pandal details")
    }

    return data.data?.[0] || null
  } catch (error) {
    console.error("Error fetching pandal details:", error)
    throw error
  }
}

// Submit user feedback
export async function submitFeedback(phoneNumber: number, feedbackText: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/saveFeedback`, {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: phoneNumber,
        feedback: feedbackText,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: ApiResponse<null> = await response.json()

    return data.status === 0
  } catch (error) {
    console.error("Error submitting feedback:", error)
    throw error
  }
}

// Calculate distance between two coordinates using Haversine formula
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Get nearest pandals based on user location
export function getNearestPandals(
  pandals: PujaPandalListItem[],
  userLat: number,
  userLng: number,
  limit = 10,
): (PujaPandalListItem & { distance: number })[] {
  const pandalsWithDistance = pandals.map((pandal) => ({
    ...pandal,
    distance: calculateDistance(userLat, userLng, pandal.latitude, pandal.longitude),
  }))

  return pandalsWithDistance.sort((a, b) => a.distance - b.distance).slice(0, limit)
}
