"use client"

import { useState } from "react"
import { AlertTriangle, MapPin, Shield, Smartphone, Bot, Newspaper, Battery, Wifi, WifiOff, Bell } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export function Dashboard() {
  const [isOnline, setIsOnline] = useState(true)
  const [batteryLevel, setBatteryLevel] = useState(85)

  const quickActions = [
    { name: "Emergency SOS", href: "/emergency", icon: Shield, color: "bg-red-600 hover:bg-red-700", urgent: true },
    { name: "Find Shelter", href: "/shelters", icon: MapPin, color: "bg-blue-600 hover:bg-blue-700" },
    { name: "AI Assistant", href: "/assistant", icon: Bot, color: "bg-green-600 hover:bg-green-700" },
    { name: "Report News", href: "/news", icon: Newspaper, color: "bg-purple-600 hover:bg-purple-700" },
  ]

  const recentAlerts = [
    { id: 1, type: "Flood Warning", severity: "High", time: "2 min ago", location: "Kuala Krai, Kelantan" },
    { id: 2, type: "Landslide Alert", severity: "Medium", time: "15 min ago", location: "Cameron Highlands" },
    { id: 3, type: "Shelter Update", severity: "Low", time: "1 hour ago", location: "SMK Damansara Jaya" },
  ]

  return (
    <div className="space-y-6">
      {/* Status Bar */}
      <Card className="dark:bg-gray-900">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {isOnline ? <Wifi className="h-4 w-4 text-green-600" /> : <WifiOff className="h-4 w-4 text-red-600" />}
                <span
                  className="text-sm font-medium tts-enabled"
                  data-tts-text={`Connection status: ${isOnline ? "Online" : "Offline Mode"}`}
                >
                  {isOnline ? "Online" : "Offline Mode"}
                </span>
              </div>
            </div>
            <Button variant="ghost" size="icon" data-tts-text="Notifications">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Alert */}
      <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800 dark:text-red-200 tts-enabled">
          <strong>Active Alert:</strong> Flash flood warning for Klang Valley. Monitor updates from JKR and stay away from flood-prone areas.
        </AlertDescription>
      </Alert>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4 tts-enabled">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.name} href={action.href}>
                <Button
                  className={`w-full h-20 flex flex-col items-center justify-center space-y-2 text-white ${action.color} ${
                    action.urgent ? "animate-pulse" : ""
                  } tts-enabled`}
                  data-tts-text={`${action.name}${action.urgent ? " - Urgent" : ""}`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-sm font-medium">{action.name}</span>
                </Button>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg tts-enabled">Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentAlerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg tts-enabled"
              data-tts-text={`${alert.type}, ${alert.severity} severity, ${alert.location}, ${alert.time}`}
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm">{alert.type}</span>
                  <Badge
                    variant={
                      alert.severity === "High" ? "destructive" : alert.severity === "Medium" ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    {alert.severity}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">{alert.location}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">{alert.time}</p>
              </div>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Device Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg tts-enabled">Connected Devices</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg tts-enabled"
            data-tts-text="HUB Sensor Device, Battery 92 percent, Signal Strong, Status Active"
          >
            <div className="flex items-center space-x-3">
              <Smartphone className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-sm">Environmental Monitoring Sensor - Ground Nodes</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Battery: 92% • Signal: Strong</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Community Updates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg tts-enabled">Community Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div
              className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg tts-enabled"
              data-tts-text="New shelter opened at SK Taman Tun Dr Ismail 2, Capacity 150 people, 5 minutes ago"
            >
              <p className="text-sm font-medium">New shelter opened at SK Taman Tun Dr Ismail 2</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Capacity: 150 people • 5 min ago</p>
            </div>
            <div
              className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg tts-enabled"
              data-tts-text="Emergency fund raised RM50,000 for flood victims in Kelantan, Goal RM100,000, 1 hour ago"
            >
              <p className="text-sm font-medium">Emergency fund raised RM50,000 for flood victims in Kelantan</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Goal: RM100,000 • 1 hour ago</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions for Text-to-Speech */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start space-x-2">
            <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200 tts-enabled">Text-to-Speech Active</p>
              <p className="text-xs text-blue-600 dark:text-blue-300 mt-1 tts-enabled">
                Press and hold any text for 800ms to hear it spoken. Use Ctrl+Space for keyboard access, or Escape to
                stop.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
