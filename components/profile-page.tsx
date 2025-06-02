"use client"

import { useState, useEffect } from "react"
import {
  User,
  Settings,
  Shield,
  Bell,
  LogOut,
  ChevronRight,
  MapPin,
  Phone,
  Heart,
  AlertTriangle,
  Download,
  Upload,
  Smartphone,
  Eye,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "next-themes"
import { useAccessibility } from "@/hooks/use-accessibility"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useEmergencyMode } from "@/components/emergency-mode-context"

export function ProfilePage() {
  const { theme, setTheme } = useTheme()
  const { settings, speakText } = useAccessibility()
  const { emergencyMode, setEmergencyMode } = useEmergencyMode()
  const router = useRouter()
  const [offlineMode, setOfflineMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [locationSharing, setLocationSharing] = useState(true)

  const userProfile = {
    name: "John Lee",
    role: "Volunteer",
    email: "john.lee@gmail.com",
    phone: "+60 12-345 6789",
    location: "Bangsar, Kuala Lumpur",
    emergencyContact: "Sarah Lee (+60 11-987 6543)",
    medicalInfo: ["Type 2 Diabetes", "Allergic to Seafood"],
    bloodType: "B+",
    joinedDate: "March 2023",
    lastActive: "Just now",
    skills: ["First Aid", "Search & Rescue", "Bahasa Malaysia", "Tamil"],
    badges: [
      { name: "First Responder", count: 5 },
      { name: "Community Leader", count: 12 },
      { name: "Flood Relief", count: 8 },
    ],
  }

  const getTextSize = () => {
    switch (settings.textSize) {
      case "small":
        return "text-xs"
      case "large":
        return "text-lg"
      case "extra-large":
        return "text-xl"
      default:
        return "text-sm"
    }
  }

  const getIconSize = () => {
    switch (settings.iconSize) {
      case "small":
        return "scale-75"
      case "large":
        return "scale-150"
      default:
        return ""
    }
  }

  const handleTextClick = (text: string) => {
    if (settings.textToSpeech) {
      speakText(text)
    }
  }

  const handleEmergencySOS = () => {
    router.push("/emergency")
  }

  const handleEmergencyContacts = () => {
    // For now, just show an alert - you can implement a contacts modal later
    alert("Emergency Contacts feature - would open contacts list")
  }

  const handleMedicalInfo = () => {
    // For now, just show an alert - you can implement a medical info modal later
    alert("Medical Information feature - would open medical details")
  }

  const handleMyDevices = () => {
    router.push("/devices")
  }

  useEffect(() => {
    // On mount, restore emergency mode from localStorage
    const storedEmergency = localStorage.getItem("emergencyMode")
    if (storedEmergency === "true") {
      setEmergencyMode(true)
      document.documentElement.classList.add("emergency-mode")
    } else {
      setEmergencyMode(false)
      document.documentElement.classList.remove("emergency-mode")
    }
    // On mount, restore offline mode from localStorage
    const storedOffline = localStorage.getItem("offlineMode")
    if (storedOffline === "true") {
      setOfflineMode(true)
      document.documentElement.classList.add("offline-mode")
    } else {
      setOfflineMode(false)
      document.documentElement.classList.remove("offline-mode")
    }
  }, [])

  const toggleEmergencyMode = (checked: boolean) => {
    setEmergencyMode(checked)
    localStorage.setItem("emergencyMode", checked ? "true" : "false")
    if (checked) {
      document.documentElement.classList.add("emergency-mode")
    } else {
      document.documentElement.classList.remove("emergency-mode")
    }
  }

  const toggleOfflineMode = (checked: boolean) => {
    setOfflineMode(checked)
    localStorage.setItem("offlineMode", checked ? "true" : "false")
    if (checked) {
      document.documentElement.classList.add("offline-mode")
    } else {
      document.documentElement.classList.remove("offline-mode")
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {userProfile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1
                className={`font-bold cursor-pointer ${settings.textSize === "large" ? "text-2xl" : settings.textSize === "extra-large" ? "text-3xl" : "text-2xl"}`}
                onClick={() => handleTextClick(userProfile.name)}
              >
                {userProfile.name}
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge>{userProfile.role}</Badge>
                <span
                  className={`text-gray-600 dark:text-gray-400 cursor-pointer ${getTextSize()}`}
                  onClick={() => handleTextClick(`Member since ${userProfile.joinedDate}`)}
                >
                  Since {userProfile.joinedDate}
                </span>
              </div>
              <p
                className={`text-gray-600 dark:text-gray-400 mt-1 cursor-pointer ${getTextSize()}`}
                onClick={() => handleTextClick(`Location: ${userProfile.location}`)}
              >
                <span className="inline-flex items-center">
                  <MapPin className={`h-3 w-3 mr-1 ${getIconSize()}`} />
                  {userProfile.location}
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="h-16 flex flex-col items-center justify-center space-y-1"
          onClick={handleEmergencySOS}
        >
          <Shield className={`text-red-600 ${getIconSize()}`} />
          <span className={getTextSize()}>Emergency SOS</span>
        </Button>
        <Button
          variant="outline"
          className="h-16 flex flex-col items-center justify-center space-y-1"
          onClick={handleEmergencyContacts}
        >
          <AlertTriangle className={`text-amber-600 ${getIconSize()}`} />
          <span className={getTextSize()}>Flood & Haze Alerts</span>
        </Button>
        <Button
          variant="outline"
          className="h-16 flex flex-col items-center justify-center space-y-1"
          onClick={handleMedicalInfo}
        >
          <Heart className={`text-purple-600 ${getIconSize()}`} />
          <span className={getTextSize()}>Medical Info</span>
        </Button>
        <Button
          variant="outline"
          className="h-16 flex flex-col items-center justify-center space-y-1"
          onClick={handleMyDevices}
        >
          <Phone className={`text-green-600 ${getIconSize()}`} />
          <span className={getTextSize()}>Emergency Hotlines</span>
        </Button>
      </div>

      {/* App Settings */}
      <Card>
        <CardHeader>
          <CardTitle
            className={`flex items-center space-x-2 ${settings.textSize === "large" ? "text-xl" : settings.textSize === "extra-large" ? "text-2xl" : "text-lg"}`}
          >
            <Settings className={getIconSize()} />
            <span>App Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className={getIconSize()} />
              <div>
                <p
                  className={`font-medium cursor-pointer ${getTextSize()}`}
                  onClick={() => handleTextClick("Notifications")}
                >
                  Notifications
                </p>
                <p
                  className={`text-gray-600 dark:text-gray-400 cursor-pointer ${settings.textSize === "large" ? "text-sm" : settings.textSize === "extra-large" ? "text-base" : "text-xs"}`}
                  onClick={() => handleTextClick("Receive alerts and updates")}
                >
                  Receive alerts and updates
                </p>
              </div>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className={getIconSize()} />
              <div>
                <p
                  className={`font-medium cursor-pointer ${getTextSize()}`}
                  onClick={() => handleTextClick("Location Sharing")}
                >
                  Location Sharing
                </p>
                <p
                  className={`text-gray-600 dark:text-gray-400 cursor-pointer ${settings.textSize === "large" ? "text-sm" : settings.textSize === "extra-large" ? "text-base" : "text-xs"}`}
                  onClick={() => handleTextClick("Share your location during emergencies")}
                >
                  Share your location during emergencies
                </p>
              </div>
            </div>
            <Switch checked={locationSharing} onCheckedChange={setLocationSharing} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className={getIconSize()} />
              <div>
                <p
                  className={`font-medium cursor-pointer ${getTextSize()}`}
                  onClick={() => handleTextClick("Dark Mode")}
                >
                  Dark Mode
                </p>
                <p
                  className={`text-gray-600 dark:text-gray-400 cursor-pointer ${settings.textSize === "large" ? "text-sm" : settings.textSize === "extra-large" ? "text-base" : "text-xs"}`}
                  onClick={() => handleTextClick("Toggle light and dark theme")}
                >
                  Toggle light/dark theme
                </p>
              </div>
            </div>
            <Switch checked={theme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Download className={getIconSize()} />
              <div>
                <p
                  className={`font-medium cursor-pointer ${getTextSize()}`}
                  onClick={() => handleTextClick("Offline Mode")}
                >
                  Offline Mode
                </p>
                <p
                  className={`text-gray-600 dark:text-gray-400 cursor-pointer ${settings.textSize === "large" ? "text-sm" : settings.textSize === "extra-large" ? "text-base" : "text-xs"}`}
                  onClick={() => handleTextClick("Save data for offline use")}
                >
                  Save data for offline use
                </p>
              </div>
            </div>
            <Switch checked={offlineMode} onCheckedChange={toggleOfflineMode} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className={`text-red-600 ${getIconSize()}`} />
              <div>
                <p
                  className={`font-medium cursor-pointer ${getTextSize()}`}
                  onClick={() => handleTextClick("Emergency Mode")}
                >
                  Emergency Mode
                </p>
                <p
                  className={`text-gray-600 dark:text-gray-400 cursor-pointer ${settings.textSize === "large" ? "text-sm" : settings.textSize === "extra-large" ? "text-base" : "text-xs"}`}
                  onClick={() => handleTextClick("Optimize for low battery and limited connectivity")}
                >
                  Optimize for low battery and limited connectivity
                </p>
              </div>
            </div>
            <Switch checked={emergencyMode} onCheckedChange={toggleEmergencyMode} />
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Settings Link */}
      <Card>
        <CardContent className="p-4">
          <Link href="/accessibility">
            <Button variant="outline" className="w-full justify-between">
              <div className="flex items-center">
                <Eye className={`mr-2 ${getIconSize()}`} />
                <span className={getTextSize()}>Accessibility Settings</span>
              </div>
              <ChevronRight className={getIconSize()} />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle
            className={`flex items-center space-x-2 ${settings.textSize === "large" ? "text-xl" : settings.textSize === "extra-large" ? "text-2xl" : "text-lg"}`}
          >
            <User className={getIconSize()} />
            <span>Personal Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span
                className={`text-gray-600 dark:text-gray-400 cursor-pointer ${getTextSize()}`}
                onClick={() => handleTextClick("Email")}
              >
                Email
              </span>
              <span
                className={`font-medium cursor-pointer ${getTextSize()}`}
                onClick={() => handleTextClick(userProfile.email)}
              >
                {userProfile.email}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span
                className={`text-gray-600 dark:text-gray-400 cursor-pointer ${getTextSize()}`}
                onClick={() => handleTextClick("Phone")}
              >
                Phone
              </span>
              <span
                className={`font-medium cursor-pointer ${getTextSize()}`}
                onClick={() => handleTextClick(userProfile.phone)}
              >
                {userProfile.phone}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span
                className={`text-gray-600 dark:text-gray-400 cursor-pointer ${getTextSize()}`}
                onClick={() => handleTextClick("Emergency Contact")}
              >
                Emergency Contact
              </span>
              <span
                className={`font-medium cursor-pointer ${getTextSize()}`}
                onClick={() => handleTextClick(userProfile.emergencyContact)}
              >
                {userProfile.emergencyContact}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span
                className={`text-gray-600 dark:text-gray-400 cursor-pointer ${getTextSize()}`}
                onClick={() => handleTextClick("Blood Type")}
              >
                Blood Type
              </span>
              <Badge
                variant="outline"
                className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 cursor-pointer"
                onClick={() => handleTextClick(`Blood type ${userProfile.bloodType}`)}
              >
                {userProfile.bloodType}
              </Badge>
            </div>
          </div>

          <div>
            <p
              className={`text-gray-600 dark:text-gray-400 mb-2 cursor-pointer ${getTextSize()}`}
              onClick={() => handleTextClick("Medical Information")}
            >
              Medical Information
            </p>
            <div className="flex flex-wrap gap-2">
              {userProfile.medicalInfo.map((info, index) => (
                <Badge key={index} variant="outline" className="cursor-pointer" onClick={() => handleTextClick(info)}>
                  {info}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <p
              className={`text-gray-600 dark:text-gray-400 mb-2 cursor-pointer ${getTextSize()}`}
              onClick={() => handleTextClick("Skills")}
            >
              Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {userProfile.skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => handleTextClick(skill)}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            <User className={`mr-2 ${getIconSize()}`} />
            <span className={getTextSize()}>Edit Profile</span>
          </Button>
        </CardFooter>
      </Card>

      {/* Badges and Achievements */}
      <Card>
        <CardHeader>
          <CardTitle
            className={`${settings.textSize === "large" ? "text-xl" : settings.textSize === "extra-large" ? "text-2xl" : "text-lg"}`}
          >
            Badges & Achievements
          </CardTitle>
          <CardDescription className={getTextSize()}>Recognition for your contributions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {userProfile.badges.map((badge, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer"
                onClick={() => handleTextClick(`${badge.name}: ${badge.count} achievements`)}
              >
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-2">
                  <span className="font-bold text-blue-800 dark:text-blue-200">{badge.count}</span>
                </div>
                <span
                  className={`text-center ${settings.textSize === "large" ? "text-sm" : settings.textSize === "extra-large" ? "text-base" : "text-xs"}`}
                >
                  {badge.name}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle
            className={`${settings.textSize === "large" ? "text-xl" : settings.textSize === "extra-large" ? "text-2xl" : "text-lg"}`}
          >
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-between">
            <div className="flex items-center">
              <Download className={`mr-2 ${getIconSize()}`} />
              <span className={getTextSize()}>Export My Data</span>
            </div>
            <ChevronRight className={getIconSize()} />
          </Button>
          <Button variant="outline" className="w-full justify-between">
            <div className="flex items-center">
              <Upload className={`mr-2 ${getIconSize()}`} />
              <span className={getTextSize()}>Import Data</span>
            </div>
            <ChevronRight className={getIconSize()} />
          </Button>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <div className="space-y-3">
        <Button variant="outline" className="w-full justify-between">
          <div className="flex items-center">
            <Settings className={`mr-2 ${getIconSize()}`} />
            <span className={getTextSize()}>Advanced Settings</span>
          </div>
          <ChevronRight className={getIconSize()} />
        </Button>
        <Button
          variant="outline"
          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
        >
          <LogOut className={`mr-2 ${getIconSize()}`} />
          <span className={getTextSize()}>Sign Out</span>
        </Button>
      </div>
    </div>
  )
}
