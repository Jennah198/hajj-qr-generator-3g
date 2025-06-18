"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Calendar, Clock, MapPin, Phone, FileText, Scan } from "lucide-react"

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

interface ProfileCardProps {
  pilgrimData: PilgrimData
  onScanQR?: (data: PilgrimData, location: GeolocationPosition) => void
}

export default function ProfileCard({ pilgrimData, onScanQR }: ProfileCardProps) {
  const [daysLeft, setDaysLeft] = useState<number>(0)
  const [isScanning, setIsScanning] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")

  // Calculate days left
  useEffect(() => {
    const calculateDaysLeft = () => {
      const startDate = new Date(pilgrimData.hajjStartDate)
      const currentDate = new Date()
      const endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + pilgrimData.totalDaysAllowed)

      const timeDiff = endDate.getTime() - currentDate.getTime()
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
      setDaysLeft(daysDiff > 0 ? daysDiff : 0)
    }

    calculateDaysLeft()
    const interval = setInterval(calculateDaysLeft, 1000 * 60 * 60) // Update every hour
    return () => clearInterval(interval)
  }, [pilgrimData.hajjStartDate, pilgrimData.totalDaysAllowed])

  // Generate QR code URL
  useEffect(() => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
    const scanUrl = `${baseUrl}/scan/${pilgrimData.id}`

    // Using QR Server API for QR code generation
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(scanUrl)}&bgcolor=ffffff&color=000000`
    setQrCodeUrl(qrUrl)
  }, [pilgrimData.id])

  const handleScanQR = async () => {
    setIsScanning(true)

    try {
      // Get geolocation
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        })
      })

      // Simulate API calls
      await simulateApiCalls(pilgrimData, position)

      // Trigger notification
      if (onScanQR) {
        onScanQR(pilgrimData, position)
      }

      // Show browser notification if permission granted
      if (Notification.permission === "granted") {
        new Notification("QR Code Scanned Successfully", {
          body: `${pilgrimData.fullName} has been scanned at your location`,
          icon: "/placeholder.svg?height=64&width=64",
        })
      }
    } catch (error) {
      console.error("Error during QR scan:", error)
      alert("Unable to get location. Please enable location services.")
    } finally {
      setIsScanning(false)
    }
  }

  const simulateApiCalls = async (data: PilgrimData, location: GeolocationPosition) => {
    // Simulate API call to travel agency
    console.log("📞 Calling Travel Agency API...", {
      agency: data.agencyName,
      pilgrim: data.fullName,
      location: {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      },
      timestamp: new Date().toISOString(),
    })

    // Simulate API call to Mejlis
    console.log("🏛️ Calling Mejlis API...", {
      pilgrimId: data.id,
      name: data.fullName,
      bloodGroup: data.bloodGroup,
      medicalNotes: data.medicalNotes,
      location: {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      },
      timestamp: new Date().toISOString(),
    })

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
  }

  // Request notification permission on component mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  return (
    <div className="max-w-md mx-auto">
      <Card className="border-2 border-yellow-400 shadow-2xl bg-white">
        {/* Header */}
        <CardHeader className="bg-black text-white text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <User className="h-6 w-6" />
            Pilgrim Profile
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Profile Photo and Basic Info */}
          <div className="text-center">
            <div className="w-24 h-24 mx-auto rounded-full border-4 border-green-700 overflow-hidden bg-gray-100 mb-4">
              {pilgrimData.profilePhoto ? (
                <img
                  src={pilgrimData.profilePhoto || "/placeholder.svg"}
                  alt={pilgrimData.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <User className="h-12 w-12" />
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-green-700 mb-2">{pilgrimData.fullName}</h2>
            <div className="flex justify-center gap-4 text-sm">
              <Badge variant="outline" className="border-green-700 text-green-700">
                Age: {pilgrimData.age}
              </Badge>
              <Badge variant="outline" className="border-red-600 text-red-600">
                {pilgrimData.bloodGroup}
              </Badge>
            </div>
          </div>

          {/* Days Counter */}
          <div className="bg-green-100 rounded-lg p-4 text-center border border-yellow-400">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-green-700" />
              <span className="font-semibold text-green-700">Days Remaining</span>
            </div>
            <div className="text-3xl font-bold text-green-700">{daysLeft}</div>
            <div className="text-sm text-yellow-600">out of {pilgrimData.totalDaysAllowed} days allowed</div>
          </div>

          {/* Details Grid */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-green-700" />
              <div>
                <p className="text-sm font-semibold text-green-700">Travel Agency</p>
                <p className="text-yellow-600">{pilgrimData.agencyName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-green-700" />
              <div>
                <p className="text-sm font-semibold text-green-700">Hajj Start Date</p>
                <p className="text-yellow-600">{new Date(pilgrimData.hajjStartDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-green-700" />
              <div>
                <p className="text-sm font-semibold text-green-700">Contact</p>
                <p className="text-yellow-600">{pilgrimData.phoneNumber}</p>
              </div>
            </div>

            {pilgrimData.medicalNotes && (
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 text-green-700 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-green-700">Medical Notes</p>
                  <p className="text-yellow-600 text-sm bg-green-50 p-2 rounded border border-yellow-400">
                    {pilgrimData.medicalNotes}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* QR Code Section */}
          <div className="text-center space-y-4">
            <div className="bg-white p-4 rounded-lg border-2 border-yellow-400 inline-block">
              {qrCodeUrl && (
                <img
                  src={qrCodeUrl || "/placeholder.svg"}
                  alt="QR Code"
                  className="w-48 h-48 mx-auto"
                  crossOrigin="anonymous"
                />
              )}
            </div>

            <Button
              onClick={handleScanQR}
              disabled={isScanning}
              className="w-full bg-black text-white hover:bg-gray-800 font-semibold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-yellow-400"
            >
              {isScanning ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-400 mr-2"></div>
                  Scanning...
                </>
              ) : (
                <>
                  <Scan className="h-5 w-5 mr-2 text-yellow-400" />
                  Scan QR Code
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
