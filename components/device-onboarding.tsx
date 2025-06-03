"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Watch,
  Zap,
  Radio,
  Shield,
  Smartphone,
  Plus,
  Wifi,
  RefreshCw,
  Check,
  Plane,
  Speaker,
  HardHat,
  ChevronRight,
  Settings,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

type DeviceType = {
  id: string
  name: string
  type: string
  icon: React.ElementType
  status: "connected" | "disconnected" | "pairing"
  battery?: number
  signal?: number
  lastSeen?: string
}

export function DeviceOnboarding() {
  const router = useRouter()

  useEffect(() => {
    // Load cached devices from localStorage
    const cachedConnected = localStorage.getItem("hub-connected-devices")
    const cachedAvailable = localStorage.getItem("hub-available-devices")

    if (cachedConnected) {
      setConnectedDevices(JSON.parse(cachedConnected))
    }

    if (cachedAvailable) {
      setAvailableDevices(JSON.parse(cachedAvailable))
    }
  }, [])

const [connectedDevices, setConnectedDevices] = useState<DeviceType[]>([
  {
    id: "dev-001",
    name: "Ground Node",
    type: "sensor", // changed from "ground-node"
    icon: Smartphone,
    status: "connected",
    battery: 92,
    signal: 85,
    lastSeen: "Just now",
  },
  {
    id: "dev-002",
    name: "Marine Buoy Node",
    type: "sensor", // changed from "marine-node"
    icon: Radio,
    status: "connected",
    battery: 78,
    signal: 65,
    lastSeen: "5 min ago",
  },
  {
    id: "dev-003",
    name: "Smart Emergency Helmet (SEH)",
    type: "helmet",
    icon: HardHat,
    status: "connected",
    battery: 88,
    signal: 90,
    lastSeen: "3 min ago",
  },
  {
    id: "dev-004",
    name: "Drones (Modular Payload System)",
    type: "drone",
    icon: Plane,
    status: "connected",
    battery: 60,
    signal: 70,
    lastSeen: "10 min ago",
  },
  {
    id: "dev-005",
    name: "Wearable (Smartwatch)",
    type: "wearable",
    icon: Watch,
    status: "connected",
    battery: 95,
    signal: 80,
    lastSeen: "Just now",
  },
  {
    id: "dev-006",
    name: "Portable LoRa Module",
    type: "lora", // changed from "module"
    icon: Speaker,
    status: "connected",
    battery: 80,
    signal: 75,
    lastSeen: "8 min ago",
  },
]);

  const [availableDevices, setAvailableDevices] = useState<DeviceType[]>([
    {
      id: "dev-003",
      name: "Smart Emergency Helmet",
      type: "helmet",
      icon: Shield, // Changed from HardHat to Shield
      status: "disconnected",
    },
    {
      id: "dev-004",
      name: "Drone Modular Payload System",
      type: "drone",
      icon: Zap,
      status: "disconnected",
    },
    {
      id: "dev-005",
      name: "Portable Lora Node",
      type: "lora",
      icon: Radio,
      status: "disconnected",
    },
    {
      id: "dev-006",
      name: "Smart Watch",
      type: "wearable",
      icon: Watch,
      status: "disconnected",
    },
  ])
  const [isScanning, setIsScanning] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<DeviceType | null>(null)
  const [pairingStep, setPairingStep] = useState(0)
  const [pairingProgress, setPairingProgress] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const [showManualAdd, setShowManualAdd] = useState(false)
  const [manualDeviceForm, setManualDeviceForm] = useState({
    name: "",
    type: "sensor",
    id: "",
  })

  const deviceCategories = [
    { id: "wearable", name: "Wearables", icon: Watch },
    { id: "drone", name: "Drones", icon: Zap },
    { id: "lora", name: "Portable Lora Nodes", icon: Radio },
    { id: "helmet", name: "Smart Emergency Helmets", icon: Shield }, // Changed from HardHat to Shield
    { id: "sensor", name: "Sensors", icon: Smartphone },
  ]

  const startScanning = () => {
    setIsScanning(true)
    // Simulate scanning for 3 seconds
    setTimeout(() => {
      setIsScanning(false)
    }, 3000)
  }

  const startPairing = (device: DeviceType) => {
    setSelectedDevice(device)
    setPairingStep(1)
    setPairingProgress(0)

    // Simulate pairing process
    const interval = setInterval(() => {
      setPairingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setPairingStep(2)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const finishPairing = () => {
    if (selectedDevice) {
      // Create connected device with additional properties
      const connectedDevice: DeviceType = {
        ...selectedDevice,
        status: "connected",
        battery: Math.floor(Math.random() * 30) + 70, // Random battery 70-100%
        signal: Math.floor(Math.random() * 40) + 60, // Random signal 60-100%
        lastSeen: "Just now",
      }

      // Add to connected devices
      const newConnectedDevices = [...connectedDevices, connectedDevice]
      setConnectedDevices(newConnectedDevices)

      // Remove from available devices
      const newAvailableDevices = availableDevices.filter((device) => device.id !== selectedDevice.id)
      setAvailableDevices(newAvailableDevices)

      // Cache to localStorage
      localStorage.setItem("hub-connected-devices", JSON.stringify(newConnectedDevices))
      localStorage.setItem("hub-available-devices", JSON.stringify(newAvailableDevices))
    }

    setSelectedDevice(null)
    setPairingStep(0)
    setPairingProgress(0)
  }

  const disconnectDevice = (deviceId: string) => {
    const deviceToDisconnect = connectedDevices.find((device) => device.id === deviceId)
    if (deviceToDisconnect) {
      // Remove from connected
      const newConnectedDevices = connectedDevices.filter((device) => device.id !== deviceId)
      setConnectedDevices(newConnectedDevices)

      // Add back to available (reset to disconnected state)
      const availableDevice: DeviceType = {
        id: deviceToDisconnect.id,
        name: deviceToDisconnect.name,
        type: deviceToDisconnect.type,
        icon: deviceToDisconnect.icon,
        status: "disconnected",
      }
      const newAvailableDevices = [...availableDevices, availableDevice]
      setAvailableDevices(newAvailableDevices)

      // Update localStorage
      localStorage.setItem("hub-connected-devices", JSON.stringify(newConnectedDevices))
      localStorage.setItem("hub-available-devices", JSON.stringify(newAvailableDevices))
    }
  }

  const viewDeviceDetails = (deviceId: string) => {
    router.push(`/devices/${deviceId}`)
  }

  const renderDeviceIcon = (Icon: React.ElementType) => {
    return <Icon className="h-6 w-6" />
  }

  const getBatteryColor = (level: number) => {
    if (level > 70) return "text-green-600"
    if (level > 30) return "text-yellow-600"
    return "text-red-600"
  }

  const getSignalColor = (level: number) => {
    if (level > 70) return "text-green-600"
    if (level > 30) return "text-yellow-600"
    return "text-red-600"
  }

  const addManualDevice = () => {
    if (!manualDeviceForm.name.trim()) return

    const newDevice: DeviceType = {
      id: manualDeviceForm.id || `manual-${Date.now()}`,
      name: manualDeviceForm.name,
      type: manualDeviceForm.type,
      icon: deviceCategories.find((cat) => cat.id === manualDeviceForm.type)?.icon || Smartphone,
      status: "disconnected",
    }

    const newAvailableDevices = [...availableDevices, newDevice]
    setAvailableDevices(newAvailableDevices)
    localStorage.setItem("hub-available-devices", JSON.stringify(newAvailableDevices))

    // Reset form and close modal
    setManualDeviceForm({ name: "", type: "sensor", id: "" })
    setShowManualAdd(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Devices</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your HUB-connected devices</p>
      </div>

      {selectedDevice && pairingStep > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Pairing {selectedDevice.name}</span>
            </CardTitle>
            <CardDescription>
              {pairingStep === 1 ? "Establishing connection..." : "Device paired successfully!"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pairingStep === 1 ? (
              <>
                <div className="flex justify-center py-6">
                  <div className="relative">
                    {renderDeviceIcon(selectedDevice.icon)}
                    <RefreshCw className="h-10 w-10 text-blue-600 animate-spin absolute -top-2 -left-2" />
                  </div>
                </div>
                <Progress value={pairingProgress} className="h-2" />
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Please keep your device powered on and nearby
                </p>
              </>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-center py-4">
                  <div className="relative">
                    {renderDeviceIcon(selectedDevice.icon)}
                    <Check className="h-6 w-6 text-green-600 bg-white dark:bg-gray-900 rounded-full absolute -top-2 -right-2" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="device-name">Device Name</Label>
                    <input
                      id="device-name"
                      className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                      defaultValue={selectedDevice.name}
                    />
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Device Settings</h4>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Wifi className="h-4 w-4" />
                        <span>Auto-connect</span>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Settings className="h-4 w-4" />
                        <span>Advanced settings</span>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          {pairingStep === 2 && (
            <CardFooter>
              <Button onClick={finishPairing} className="w-full">
                Complete Setup
              </Button>
            </CardFooter>
          )}
        </Card>
      ) : (
        <Tabs defaultValue="connected">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="connected">Connected</TabsTrigger>
            <TabsTrigger value="add">Add Device</TabsTrigger>
          </TabsList>

          <TabsContent value="connected" className="space-y-4 mt-4">
            {connectedDevices.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No devices connected</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => document.querySelector('[data-value="add"]')?.click()}
                >
                  Add a device
                </Button>
              </div>
            ) : (
              connectedDevices.map((device) => (
                <Card
                  key={device.id}
                  className="cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                  onClick={() => viewDeviceDetails(device.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                          {renderDeviceIcon(device.icon)}
                        </div>
                        <div>
                          <h3 className="font-medium">{device.name}</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{device.lastSeen}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          >
                            Connected
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              disconnectDevice(device.id)
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            Disconnect
                          </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`text-xs ${getBatteryColor(device.battery || 0)}`}>{device.battery}%</div>
                          <div className={`text-xs ${getSignalColor(device.signal || 0)}`}>{device.signal}%</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="add" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Add a new device</CardTitle>
                <CardDescription>Select a device category or scan for nearby devices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {deviceCategories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      className="h-24 flex flex-col items-center justify-center space-y-2"
                      onClick={() => {
                        setSelectedCategory(selectedCategory === category.id ? null : category.id)
                      }}
                    >
                      {renderDeviceIcon(category.icon)}
                      <span className="text-sm">{category.name}</span>
                    </Button>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Available Devices</h3>
                    <div className="flex items-center space-x-2">
                      {selectedCategory && (
                        <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(null)} className="text-xs">
                          Clear Filter
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={startScanning}
                        disabled={isScanning}
                        className="flex items-center space-x-1"
                      >
                        <RefreshCw className={`h-4 w-4 ${isScanning ? "animate-spin" : ""}`} />
                        <span>{isScanning ? "Scanning..." : "Scan"}</span>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {availableDevices
                      .filter((device) => !selectedCategory || device.type === selectedCategory)
                      .map((device) => (
                        <div
                          key={device.id}
                          className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                              {renderDeviceIcon(device.icon)}
                            </div>
                            <div>
                              <h4 className="font-medium">{device.name}</h4>
                              <p className="text-xs text-gray-600 dark:text-gray-400">{device.type}</p>
                            </div>
                          </div>
                          <Button size="sm" onClick={() => startPairing(device)}>
                            Pair
                          </Button>
                        </div>
                      ))}
                    {selectedCategory &&
                      availableDevices.filter((device) => device.type === selectedCategory).length === 0 && (
                        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                          <p>No {selectedCategory} devices available</p>
                        </div>
                      )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center border-t pt-4">
                <Button variant="outline" className="w-full" onClick={() => setShowManualAdd(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Device Manually
                </Button>
              </CardFooter>
            </Card>
            {showManualAdd && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Add Device Manually</CardTitle>
                  <CardDescription>Enter device information manually</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="manual-device-name">Device Name</Label>
                    <input
                      id="manual-device-name"
                      className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                      placeholder="Enter device name"
                      value={manualDeviceForm.name}
                      onChange={(e) => setManualDeviceForm({ ...manualDeviceForm, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="manual-device-type">Device Type</Label>
                    <select
                      id="manual-device-type"
                      className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                      value={manualDeviceForm.type}
                      onChange={(e) => setManualDeviceForm({ ...manualDeviceForm, type: e.target.value })}
                    >
                      {deviceCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="manual-device-id">Device ID (Optional)</Label>
                    <input
                      id="manual-device-id"
                      className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                      placeholder="Leave empty for auto-generated ID"
                      value={manualDeviceForm.id}
                      onChange={(e) => setManualDeviceForm({ ...manualDeviceForm, id: e.target.value })}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex space-x-2">
                  <Button variant="outline" className="flex-1" onClick={() => setShowManualAdd(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={addManualDevice} disabled={!manualDeviceForm.name.trim()}>
                    Add Device
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
