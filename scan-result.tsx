"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, User, Calendar, Clock, MapPin, Phone, FileText, Navigation, ArrowLeft } from "lucide-react"

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

interface ScanResultProps {
  pilgrimData: PilgrimData
  scanLocation?: GeolocationPosition
  onBack?: () => void
}

export default function ScanResult({ pilgrimData, scanLocation, onBack }: ScanResultProps) {
  const [currentDate, setCurrentDate] = useState<string>("")
  const [locationName, setLocationName] = useState<string>("Getting location...")
  const [daysLeft, setDaysLeft] = useState<number>(0)

  // Update current date
  useEffect(() => {
    const updateDate = () => {
      setCurrentDate(new Date().toLocaleString())
    }
    updateDate()
    const interval = setInterval(updateDate, 1000)
    return () => clearInterval(interval)
  }, [])

  // Calculate days left
  useEffect(() => {
    const startDate = new Date(pilgrimData.hajjStartDate)
    const currentDate = new Date()
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + pilgrimData.totalDaysAllowed)

    const timeDiff = endDate.getTime() - currentDate.getTime()
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
    setDaysLeft(daysDiff > 0 ? daysDiff : 0)
  }, [pilgrimData.hajjStartDate, pilgrimData.totalDaysAllowed])

  // Get location name from coordinates
  useEffect(() => {
    if (scanLocation) {
      const { latitude, longitude } = scanLocation.coords

      // Simulate reverse geocoding (in real app, use Google Maps API or similar)
      const mockLocations = [
        "Masjid al-Haram, Mecca",
        "Masjid an-Nabawi, Medina",
        "Mount Arafat",
        "Mina Valley",
        "Muzdalifah",
        "Jamarat Bridge",
      ]

      const randomLocation = mockLocations[Math.floor(Math.random() * mockLocations.length)]
      setLocationName(`${randomLocation} (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`)
    }
  }, [scanLocation])

  // Simulate API notifications
  useEffect(() => {
    const sendNotifications = async () => {
      // Simulate delay for API calls
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("🚨 ALERT SENT TO TRAVEL AGENCY:", {
        agency: pilgrimData.agencyName,
        message: `Pilgrim ${pilgrimData.fullName} scanned at ${locationName}`,
        timestamp: currentDate,
        pilgrimId: pilgrimData.id,
        location: scanLocation
          ? {
              lat: scanLocation.coords.latitude,
              lng: scanLocation.coords.longitude,
            }
          : null,
      })

      console.log("🏛️ ALERT SENT TO MEJLIS:", {
        department: "Hajj Management System",
        pilgrimId: pilgrimData.id,
        name: pilgrimData.fullName,
        bloodGroup: pilgrimData.bloodGroup,
        medicalNotes: pilgrimData.medicalNotes,
        agencyName: pilgrimData.agencyName,
        scanLocation: locationName,
        timestamp: currentDate,
        daysRemaining: daysLeft,
        coordinates: scanLocation
          ? {
              lat: scanLocation.coords.latitude,
              lng: scanLocation.coords.longitude,
              accuracy: scanLocation.coords.accuracy,
            }
          : null,
      })
    }

    sendNotifications()
  }, [pilgrimData, scanLocation, locationName, currentDate, daysLeft])

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Success Banner */}
        <Card className="border-2 border-green-700 bg-green-50 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-3 text-green-700">
              <CheckCircle className="h-12 w-12" />
              <div className="text-center">
                <h1 className="text-3xl font-bold">Successfully Scanned!</h1>
                <p className="text-lg mt-1">Pilgrim information retrieved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scan Info */}
        <Card className="border-2 border-yellow-400 shadow-xl">
          <CardHeader className="bg-black text-white">
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-6 w-6" />
              Scan Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-green-700">Scan Date & Time</p>
                <p className="text-yellow-600">{currentDate}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-green-700">Location</p>
                <p className="text-yellow-600">{locationName}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pilgrim Information */}
        <Card className="border-2 border-yellow-400 shadow-xl">
          <CardHeader className="bg-black text-white">
            <CardTitle className="flex items-center gap-2">
              <User className="h-6 w-6" />
              Pilgrim Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Profile Section */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full border-4 border-green-700 overflow-hidden bg-gray-100">
                {pilgrimData.profilePhoto ? (
                  <img
                    src={pilgrimData.profilePhoto || "/placeholder.svg"}
                    alt={pilgrimData.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <User className="h-8 w-8" />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-green-700">{pilgrimData.fullName}</h2>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="border-green-700 text-green-700">
                    Age: {pilgrimData.age}
                  </Badge>
                  <Badge variant="outline" className="border-red-600 text-red-600">
                    {pilgrimData.bloodGroup}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Status Alert */}
            <div
              className={`p-4 rounded-lg border-2 ${
                daysLeft > 7
                  ? "bg-green-100 border-green-700"
                  : daysLeft > 0
                    ? "bg-yellow-100 border-yellow-400"
                    : "bg-red-100 border-red-600"
              }`}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock
                  className={`h-5 w-5 ${
                    daysLeft > 7 ? "text-green-700" : daysLeft > 0 ? "text-yellow-600" : "text-red-600"
                  }`}
                />
                <span
                  className={`font-semibold ${
                    daysLeft > 7 ? "text-green-700" : daysLeft > 0 ? "text-yellow-600" : "text-red-600"
                  }`}
                >
                  {daysLeft > 0 ? "Days Remaining" : "Pilgrimage Expired"}
                </span>
              </div>
              <div
                className={`text-3xl font-bold text-center ${
                  daysLeft > 7 ? "text-green-700" : daysLeft > 0 ? "text-yellow-600" : "text-red-600"
                }`}
              >
                {daysLeft}
              </div>
              <div className="text-sm text-center text-gray-600">
                out of {pilgrimData.totalDaysAllowed} days allowed
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-green-700 flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Travel Agency
                  </p>
                  <p className="text-yellow-600">{pilgrimData.agencyName}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-green-700 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Hajj Start Date
                  </p>
                  <p className="text-yellow-600">{new Date(pilgrimData.hajjStartDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-green-700 flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </p>
                  <p className="text-yellow-600">{pilgrimData.phoneNumber}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-green-700">Emergency Contact</p>
                  <p className="text-yellow-600">{pilgrimData.emergencyContact}</p>
                </div>
              </div>
            </div>

            {/* Medical Notes */}
            {pilgrimData.medicalNotes && (
              <div>
                <p className="text-sm font-semibold text-green-700 flex items-center gap-1 mb-2">
                  <FileText className="h-4 w-4" />
                  Medical Notes
                </p>
                <div className="bg-green-100 p-3 rounded border border-yellow-400">
                  <p className="text-yellow-600">{pilgrimData.medicalNotes}</p>
                </div>
              </div>
            )}

            {/* Back Button */}
            {onBack && (
              <Button
                onClick={onBack}
                className="w-full bg-black text-white hover:bg-gray-800 font-semibold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-yellow-400"
              >
                <ArrowLeft className="h-5 w-5 mr-2 text-yellow-400" />
                Back to Profile
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
