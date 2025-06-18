"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, User, Phone, FileText, Clock, MapPin } from "lucide-react"

interface FormData {
  fullName: string
  profilePicture: File | null
  age: string
  bloodGroup: string
  medicalNotes: string
  totalDaysAllowed: string
  hajjStartDate: string
  travelAgencyName: string
  phoneNumber: string
  emergencyContact: string
}

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

interface RegistrationFormProps {
  onGenerateQR: (pilgrimData: PilgrimData) => void
}

export default function RegistrationForm({ onGenerateQR }: RegistrationFormProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    profilePicture: null,
    age: "",
    bloodGroup: "",
    medicalNotes: "",
    totalDaysAllowed: "",
    hajjStartDate: "",
    travelAgencyName: "Oscar travel",
    phoneNumber: "+251 90000 4848",
    emergencyContact: "",
  })

  const [profileImageUrl, setProfileImageUrl] = useState<string>("")
  const [countdownDays, setCountdownDays] = useState<number>(0)

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

  const travelAgencies = [
    "Oscar travel",
    "Mecca Travel Services",
    "Al-Haramain Tours",
    "Medina Express Travel",
    "Hajj & Umrah Services",
    "Golden Gate Travel",
    "Pilgrimage Plus",
    "Sacred Journey Tours",
    "Kaaba Travel Agency",
    "Holy Land Expeditions",
  ]

  useEffect(() => {
    if (formData.hajjStartDate) {
      const startDate = new Date(formData.hajjStartDate)
      const today = new Date()
      const timeDiff = startDate.getTime() - today.getTime()
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
      setCountdownDays(daysDiff > 0 ? daysDiff : 0)
    }
  }, [formData.hajjStartDate])

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, profilePicture: file }))

    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImageUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setProfileImageUrl("")
    }
  }

  const handleGenerateQR = () => {
    // Validate required fields
    if (
      !formData.fullName ||
      !formData.age ||
      !formData.bloodGroup ||
      !formData.totalDaysAllowed ||
      !formData.hajjStartDate
    ) {
      alert("Please fill in all required fields")
      return
    }

    // Convert form data to pilgrim data
    const pilgrimData: PilgrimData = {
      id: `PIL-${Date.now()}`,
      fullName: formData.fullName,
      age: Number.parseInt(formData.age),
      bloodGroup: formData.bloodGroup,
      medicalNotes: formData.medicalNotes,
      agencyName: formData.travelAgencyName,
      totalDaysAllowed: Number.parseInt(formData.totalDaysAllowed),
      hajjStartDate: formData.hajjStartDate,
      phoneNumber: formData.phoneNumber,
      emergencyContact: formData.emergencyContact,
      profilePhoto: profileImageUrl,
    }

    onGenerateQR(pilgrimData)
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-700 mb-2">Hajj Registration Form</h1>
          <p className="text-gray-600">Complete your pilgrimage registration details</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="border-2 border-yellow-400 shadow-xl">
            <CardHeader className="bg-black text-white">
              <CardTitle className="flex items-center gap-2">
                <User className="h-6 w-6" />
                Registration Details
              </CardTitle>
              <CardDescription className="text-green-100">
                Please fill in all required information accurately
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-green-700 font-semibold">
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder="Enter your full name"
                  className="bg-green-100 border-yellow-400 focus:border-yellow-400 focus:ring-yellow-400/20"
                />
              </div>

              {/* Profile Picture */}
              <div className="space-y-2">
                <Label htmlFor="profilePicture" className="text-green-700 font-semibold">
                  Profile Picture
                </Label>
                <Input
                  id="profilePicture"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="bg-green-100 border-yellow-400 focus:border-yellow-400 focus:ring-yellow-400/20 file:bg-yellow-400 file:text-black file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-3"
                />
              </div>

              {/* Age and Blood Group Row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-green-700 font-semibold">
                    Age *
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    placeholder="Enter age"
                    min="1"
                    max="120"
                    className="bg-green-100 border-yellow-400 focus:border-yellow-400 focus:ring-yellow-400/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bloodGroup" className="text-green-700 font-semibold">
                    Blood Group *
                  </Label>
                  <Select value={formData.bloodGroup} onValueChange={(value) => handleInputChange("bloodGroup", value)}>
                    <SelectTrigger className="bg-green-100 border-yellow-400 focus:border-yellow-400 focus:ring-yellow-400/20">
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodGroups.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Medical Notes */}
              <div className="space-y-2">
                <Label htmlFor="medicalNotes" className="text-green-700 font-semibold">
                  Medical Notes
                </Label>
                <Textarea
                  id="medicalNotes"
                  value={formData.medicalNotes}
                  onChange={(e) => handleInputChange("medicalNotes", e.target.value)}
                  placeholder="Any medical conditions or notes..."
                  className="bg-green-100 border-yellow-400 focus:border-yellow-400 focus:ring-yellow-400/20 min-h-[100px]"
                />
              </div>

              {/* Total Days and Start Date Row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalDays" className="text-green-700 font-semibold">
                    Total Days Allowed *
                  </Label>
                  <Input
                    id="totalDays"
                    type="number"
                    value={formData.totalDaysAllowed}
                    onChange={(e) => handleInputChange("totalDaysAllowed", e.target.value)}
                    placeholder="Enter days"
                    min="1"
                    className="bg-green-100 border-yellow-400 focus:border-yellow-400 focus:ring-yellow-400/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hajjStartDate" className="text-green-700 font-semibold">
                    Hajj Start Date *
                  </Label>
                  <Input
                    id="hajjStartDate"
                    type="date"
                    value={formData.hajjStartDate}
                    onChange={(e) => handleInputChange("hajjStartDate", e.target.value)}
                    className="bg-green-100 border-yellow-400 focus:border-yellow-400 focus:ring-yellow-400/20"
                  />
                </div>
              </div>

              {/* Travel Agency */}
              <div className="space-y-2">
                <Label htmlFor="travelAgency" className="text-green-700 font-semibold">
                  Travel Agency Name *
                </Label>
                <Select
                  value={formData.travelAgencyName}
                  onValueChange={(value) => handleInputChange("travelAgencyName", value)}
                >
                  <SelectTrigger className="bg-green-100 border-yellow-400 focus:border-yellow-400 focus:ring-yellow-400/20">
                    <SelectValue placeholder="Select travel agency" />
                  </SelectTrigger>
                  <SelectContent>
                    {travelAgencies.map((agency) => (
                      <SelectItem key={agency} value={agency}>
                        {agency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Phone Numbers Row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-green-700 font-semibold">
                    Phone Number *
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    placeholder="Enter phone number"
                    className="bg-green-100 border-yellow-400 focus:border-yellow-400 focus:ring-yellow-400/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact" className="text-green-700 font-semibold">
                    Emergency Contact *
                  </Label>
                  <Input
                    id="emergencyContact"
                    type="tel"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                    placeholder="Emergency contact number"
                    className="bg-green-100 border-yellow-400 focus:border-yellow-400 focus:ring-yellow-400/20"
                  />
                </div>
              </div>

              {/* Generate QR Button */}
              <Button
                onClick={handleGenerateQR}
                className="w-full bg-black text-white hover:bg-gray-800 font-semibold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-yellow-400"
                size="lg"
              >
                <span className="text-yellow-400 mr-2">✨</span>
                Generate QR Code
                <span className="text-yellow-400 ml-2">✨</span>
              </Button>
            </CardContent>
          </Card>

          {/* Preview Card */}
          <Card className="border-2 border-yellow-400 shadow-xl h-fit sticky top-4">
            <CardHeader className="bg-black text-white">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Profile Preview
              </CardTitle>
              <CardDescription className="text-yellow-800">Live preview of your registration</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {/* Profile Picture Preview */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto rounded-full border-4 border-green-700 overflow-hidden bg-gray-100">
                  {profileImageUrl ? (
                    <img
                      src={profileImageUrl || "/placeholder.svg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <User className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-green-700 mt-3">{formData.fullName || "Full Name"}</h3>
              </div>

              {/* Countdown */}
              {formData.hajjStartDate && (
                <div className="bg-green-100 rounded-lg p-4 mb-6 text-center border border-yellow-400">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-green-700" />
                    <span className="font-semibold text-green-700">Days Until Hajj</span>
                  </div>
                  <div className="text-3xl font-bold text-green-700">{countdownDays}</div>
                  <div className="text-sm text-yellow-600">
                    {countdownDays === 0 ? "Today!" : countdownDays === 1 ? "day remaining" : "days remaining"}
                  </div>
                </div>
              )}

              {/* Profile Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold text-green-700">Age</Label>
                    <p className="text-yellow-600">{formData.age || "Not set"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-green-700">Blood Group</Label>
                    <p className="text-yellow-600">{formData.bloodGroup || "Not set"}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-semibold text-green-700">Total Days Allowed</Label>
                  <p className="text-yellow-600">{formData.totalDaysAllowed || "Not set"}</p>
                </div>

                <div>
                  <Label className="text-sm font-semibold text-green-700 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Hajj Start Date
                  </Label>
                  <p className="text-yellow-600">
                    {formData.hajjStartDate ? new Date(formData.hajjStartDate).toLocaleDateString() : "Not set"}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-semibold text-green-700 flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Travel Agency
                  </Label>
                  <p className="text-yellow-600">{formData.travelAgencyName || "Not set"}</p>
                </div>

                <div>
                  <Label className="text-sm font-semibold text-green-700 flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  <p className="text-yellow-600">{formData.phoneNumber || "Not set"}</p>
                </div>

                <div>
                  <Label className="text-sm font-semibold text-green-700">Emergency Contact</Label>
                  <p className="text-yellow-600">{formData.emergencyContact || "Not set"}</p>
                </div>

                {formData.medicalNotes && (
                  <div>
                    <Label className="text-sm font-semibold text-green-700">Medical Notes</Label>
                    <p className="text-yellow-600 text-sm bg-green-100 p-2 rounded border border-yellow-400">
                      {formData.medicalNotes}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
