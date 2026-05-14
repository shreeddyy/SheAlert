export interface User {
  id: string
  name: string
  email: string
  passwordHash: string
  createdAt: string
}

export interface Session {
  token: string
  userId: string
  createdAt: string
}

export interface Contact {
  id: string
  userId: string
  name: string
  phone: string
  relation?: string
  createdAt: string
}

export interface SOSAlert {
  id: string
  userId?: string
  message: string
  tapCount: number
  location?: {
    latitude: number
    longitude: number
  }
  createdAt: string
}

export interface LocationShare {
  id: string
  userId?: string
  latitude: number
  longitude: number
  contactNames: string[]
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface ThreatAnalysis {
  id: string
  userId?: string
  prompt: string
  threatLevel: "LOW" | "MEDIUM" | "HIGH"
  observations: string[]
  recommendations: string[]
  createdAt: string
}

export interface AudioRecord {
  id: string
  userId?: string
  filename: string
  mimeType: string
  duration: number
  size: number
  filePath: string
  createdAt: string
}

export interface SafeLocation {
  id: string
  name: string
  type: "police" | "hospital" | "shelter" | "public"
  latitude: number
  longitude: number
  distanceKm: number
  directions: string[]
}

export interface SafetyPlan {
  id: string
  userId: string
  safeWord: string
  meetingPoint: string
  medicalNotes: string
  emergencyNote: string
  checklist: {
    emergencyContactsReady: boolean
    locationSharingReady: boolean
    audioEvidenceReady: boolean
    safeRouteReviewed: boolean
    emergencyBagReady: boolean
  }
  updatedAt: string
}

export interface Journey {
  id: string
  userId: string
  title: string
  destination: string
  transportMode: "walking" | "cab" | "public-transport" | "personal-vehicle"
  etaMinutes: number
  startLatitude?: number
  startLongitude?: number
  destinationLatitude?: number
  destinationLongitude?: number
  guardianContactIds: string[]
  notes: string
  status: "active" | "completed" | "cancelled"
  startedAt: string
  completedAt?: string
  checkInDeadline: string
}

export interface DatabaseSchema {
  users: User[]
  sessions: Session[]
  contacts: Contact[]
  sosAlerts: SOSAlert[]
  locationShares: LocationShare[]
  threatAnalyses: ThreatAnalysis[]
  audioRecords: AudioRecord[]
  safetyPlans: SafetyPlan[]
  journeys: Journey[]
}
