"use client"

import { useState } from "react"
import ProfileCard from "../profile-card"
import ScanResult from "../scan-result"
import RegistrationForm from "../registration-form"

interface PilgrimData {
  id: string
  fullName: string
  age: number
  bloodGroup: string
  medicalNotes: string
  agencyName: string
  totalDaysAllowed: number
  hajjStartDate: string
  phoneNumber: string
  emergencyContact: string
  profilePhoto?: string
}

export default function Page() {
  const [currentView, setCurrentView] = useState<"form" | "profile" | "scan">("form")
  const [pilgrimData, setPilgrimData] = useState<PilgrimData | null>(null)
  const [scanLocation, setScanLocation] = useState<GeolocationPosition | undefined>()

  const handleGenerateQR = (data: PilgrimData) => {
    setPilgrimData(data)
    setCurrentView("profile")
  }

  const handleScanQR = (data: PilgrimData, location: GeolocationPosition) => {
    setScanLocation(location)
    setCurrentView("scan")
  }

  const handleBackToProfile = () => {
    setCurrentView("profile")
    setScanLocation(undefined)
  }

  const handleBackToForm = () => {
    setCurrentView("form")
    setPilgrimData(null)
    setScanLocation(undefined)
  }

  if (currentView === "form") {
    return <RegistrationForm onGenerateQR={handleGenerateQR} />
  }

  if (currentView === "scan" && pilgrimData) {
    return <ScanResult pilgrimData={pilgrimData} scanLocation={scanLocation} onBack={handleBackToProfile} />
  }

  if (currentView === "profile" && pilgrimData) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-green-700 mb-2">Hajj Pilgrim System</h1>
            <p className="text-gray-600">Digital identification and tracking system</p>
            <button onClick={handleBackToForm} className="mt-4 text-yellow-600 hover:text-yellow-700 underline">
              ← Back to Registration Form
            </button>
          </div>

          <ProfileCard pilgrimData={pilgrimData} onScanQR={handleScanQR} />
        </div>
      </div>
    )
  }

  return null
}
