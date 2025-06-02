"use client"

import { useState } from "react"
import { AlertTriangle, MapPin, Clock, Filter, Bell, BellOff } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function AlertsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [filter, setFilter] = useState("all")

const alerts = [
  {
    id: 1,
    type: "Earthquake",
    severity: "High",
    time: "2 minutes ago",
    location: "Kuala Lumpur City Centre, 3.7 km away",
    description: "Magnitude 5.2 earthquake detected near the city. Seek shelter immediately.",
    active: true,
  },
  {
    id: 2,
    type: "Flood Warning",
    severity: "Medium",
    time: "15 minutes ago",
    location: "Klang River Basin, 6.6 km away",
    description: "Heavy rainfall is causing potential flooding in low-lying areas.",
    active: true,
  },
  {
    id: 3,
    type: "Shelter Update",
    severity: "Low",
    time: "1 hour ago",
    location: "Bukit Damansara Community Hall, 2.9 km away",
    description: "New emergency shelter opened with capacity for 200 people.",
    active: false,
  },
  {
    id: 4,
    type: "Weather Alert",
    severity: "Medium",
    time: "2 hours ago",
    location: "Greater Klang Valley",
    description: "Severe thunderstorm warning in effect until 8 PM. Expect strong winds and lightning.",
    active: false,
  },
  {
    id: 5,
    type: "Road Closure",
    severity: "Low",
    time: "3 hours ago",
    location: "Tun Razak Bridge, Kuala Lumpur",
    description: "Bridge closed for structural inspection. Please use alternative routes.",
    active: false,
  },
]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "destructive"
      case "Medium":
        return "default"
      case "Low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case "High":
        return "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
      case "Medium":
        return "bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800"
      case "Low":
        return "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800"
      default:
        return "bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-700"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Alerts</h1>
        <Button variant="ghost" size="icon">
          <Filter className="h-5 w-5" />
        </Button>
      </div>

      {/* Notification Settings */}
      <Card className="dark:bg-gray-900">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {notificationsEnabled ? (
                <Bell className="h-5 w-5 text-green-600" />
              ) : (
                <BellOff className="h-5 w-5 text-gray-400" />
              )}
              <span className="font-medium">Push Notifications</span>
            </div>
            <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-red-600">Active Alerts</h2>
        <div className="space-y-3">
          {alerts
            .filter((alert) => alert.active)
            .map((alert) => (
              <Card key={alert.id} className={`${getSeverityBg(alert.severity)} border-l-4`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <span className="font-semibold">{alert.type}</span>
                      <Badge variant={getSeverityColor(alert.severity) as any}>{alert.severity}</Badge>
                    </div>
                    <span className="text-xs text-gray-500">{alert.time}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{alert.description}</p>
                  <div className="flex items-center space-x-1 text-xs text-gray-600">
                    <MapPin className="h-3 w-3" />
                    <span>{alert.location}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* Recent Alerts */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Alerts</h2>
        <div className="space-y-3">
          {alerts
            .filter((alert) => !alert.active)
            .map((alert) => (
              <Card key={alert.id} className="border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">{alert.type}</span>
                      <Badge variant="outline" className="text-xs">
                        {alert.severity}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500">{alert.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{alert.description}</p>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <MapPin className="h-3 w-3" />
                    <span>{alert.location}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* Alert Settings */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          You can customize your alert preferences in the Settings page to receive only the most relevant notifications
          for your location.
        </AlertDescription>
      </Alert>
    </div>
  )
}
