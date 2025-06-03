"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  Battery,
  Wifi,
  Download,
  Info,
  Gauge,
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  Radio,
  Cpu,
  Clock,
  Zap,
  Smartphone,
  Watch,
  Shield,
  Activity,
  BarChart3,
  Compass,
  Heart,
  Footprints,
  Waves,
  MicIcon as Microphone,
  AlertTriangle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

type DeviceType = {
  id: string
  name: string
  type: string
  icon: React.ElementType
  status: "connected" | "disconnected" | "pairing"
  battery?: number
  signal?: number
  lastSeen?: string
  firmware?: string
  location?: {
    latitude: number
    longitude: number
    region: string
  }
  metrics?: Record<string, any>
  sensors?: Array<{
    name: string
    type: string
    pins?: string
    value: string
    status?: string
  }>
  events?: Array<{
    type: string
    severity: "info" | "warning" | "error"
    message: string
    time: string
  }>
}

export function DeviceDetails({ 
  deviceId,
  onDeviceLoad
}: { 
  deviceId: string,
  onDeviceLoad?: (device: DeviceType) => void 
}) {
  const router = useRouter()
  const [device, setDevice] = useState<DeviceType | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Load device from localStorage or generate mock data
    const cachedConnected = localStorage.getItem("hub-connected-devices")
    let foundDevice = null

    if (cachedConnected) {
      const devices = JSON.parse(cachedConnected)
      foundDevice = devices.find((d: any) => d.id === deviceId)
    }

    if (foundDevice) {
      // Enhance the device with additional mock data based on device type
      const enhancedDevice = enhanceDeviceWithMockData(foundDevice)
      setDevice(enhancedDevice)
      onDeviceLoad?.(enhancedDevice)
    } else {
      // If device not found, create a mock device for demo
      const mockDevice = createMockDevice(deviceId)
      setDevice(mockDevice)
      onDeviceLoad?.(mockDevice)
    }
  }, [deviceId])

  const enhanceDeviceWithMockData = (baseDevice: DeviceType): DeviceType => {
    // Normalize type for all possible values
    let normalizedType = baseDevice.type
    if (["ground-node", "marine-node", "module"].includes(baseDevice.type)) {
      if (baseDevice.type === "module") normalizedType = "lora"
      else normalizedType = "sensor"
    }
    switch (normalizedType) {
      case "lora":
        return {
          ...baseDevice,
          type: "lora",
          firmware: "v3.1.2",
          location: {
            latitude: 3.139,
            longitude: 101.6869,
            region: "Kuala Lumpur, Malaysia",
          },
          metrics: {
            range: "2.5 km",
            connectedNodes: 4,
            packetLoss: "2.3%",
            dataRate: "5.2 kbps",
            frequency: "915 MHz",
            txPower: "14 dBm",
            spreadingFactor: "SF9",
            bandwidth: "125 kHz",
          },
          sensors: [
            {
              name: "SX1278 LoRa Module",
              type: "SPI + GPIO",
              pins: "SCK: GPIO 18, MISO: GPIO 19, MOSI: GPIO 23, NSS: GPIO 5",
              value: "Connected",
            },
            {
              name: "Network Status",
              type: "System",
              value: "Active",
              status: "good",
            },
            {
              name: "Antenna",
              type: "External",
              value: "Gain: 3dBi",
              status: "good",
            },
            {
              name: "PTT Button",
              type: "Digital input",
              pins: "GPIO 12",
              value: "Released",
            },
            {
              name: "Status LED",
              type: "Digital output",
              pins: "GPIO 13",
              value: "On",
            },
          ],
          events: [
            {
              type: "Connection",
              severity: "info",
              message: "Node joined mesh network",
              time: "30 minutes ago",
            },
            {
              type: "Data",
              severity: "info",
              message: "Relayed 24 messages from other nodes",
              time: "1 hour ago",
            },
            {
              type: "System",
              severity: "warning",
              message: "Weak signal detected from node 3",
              time: "2 hours ago",
            },
          ],
        }
      case "helmet":
        return {
          ...baseDevice,
          type: "helmet",
          firmware: "v2.0.5",
          location: {
            latitude: 3.142,
            longitude: 101.6912,
            region: "Kuala Lumpur, Malaysia",
          },
          metrics: {
            impactDetection: "Active",
            temperatureInside: "28.3°C",
            temperatureOutside: "32.1°C",
            oxygenLevel: "20.9%",
            gasDetection: "Normal",
            motionStatus: "Moving",
            userStatus: "Active",
            lightLevel: "420 lux",
          },
          sensors: [
            {
              name: "Impact Sensor",
              type: "Accelerometer",
              pins: "I2C: SDA/SCL",
              value: "0.02g",
              status: "good",
            },
            {
              name: "Temperature (Inside)",
              type: "Digital",
              pins: "GPIO 4",
              value: "28.3°C",
              status: "good",
            },
            {
              name: "Gas Sensor (CO)",
              type: "Analog",
              pins: "ADC1",
              value: "0 ppm",
              status: "good",
            },
            {
              name: "Oxygen Sensor",
              type: "Analog",
              pins: "ADC2",
              value: "20.9%",
              status: "good",
            },
            {
              name: "Flashlight",
              type: "Digital output",
              pins: "GPIO 13",
              value: "Off",
            },
            {
              name: "Emergency Button",
              type: "Digital input",
              pins: "GPIO 0",
              value: "Not Pressed",
            },
          ],
          events: [
            {
              type: "System",
              severity: "info",
              message: "Helmet powered on",
              time: "2 hours ago",
            },
            {
              type: "User",
              severity: "info",
              message: "User authenticated",
              time: "2 hours ago",
            },
            {
              type: "Environment",
              severity: "info",
              message: "All environmental readings normal",
              time: "1 hour ago",
            },
          ],
        }
      case "drone":
        return {
          ...baseDevice,
          type: "drone",
          firmware: "v4.2.1",
          location: {
            latitude: 3.135,
            longitude: 101.6823,
            region: "Kuala Lumpur, Malaysia",
          },
          metrics: {
            altitude: "45.2 m",
            speed: "8.3 m/s",
            flightTime: "18 min",
            remainingTime: "22 min",
            distance: "1.2 km",
            heading: "NE (45°)",
            windSpeed: "3.1 m/s",
            missionProgress: "42%",
          },
          sensors: [
            {
              name: "GPS",
              type: "UART",
              pins: "RX/TX",
              value: "3.135° N, 101.6823° E",
              status: "good",
            },
            {
              name: "Barometer",
              type: "I2C",
              pins: "SDA/SCL",
              value: "1013 hPa",
              status: "good",
            },
            {
              name: "Camera",
              type: "Digital",
              value: "Recording (1080p)",
              status: "good",
            },
            {
              name: "Propulsion",
              type: "ESC",
              value: "All motors nominal",
              status: "good",
            },
            {
              name: "Obstacle Sensors",
              type: "Ultrasonic",
              value: "Clear (>5m all directions)",
              status: "good",
            },
          ],
          events: [
            {
              type: "Flight",
              severity: "info",
              message: "Takeoff successful",
              time: "18 minutes ago",
            },
            {
              type: "Mission",
              severity: "info",
              message: "Waypoint 3/7 reached",
              time: "10 minutes ago",
            },
            {
              type: "System",
              severity: "warning",
              message: "Wind speed increasing",
              time: "5 minutes ago",
            },
          ],
        }
      case "wearable":
        return {
          ...baseDevice,
          type: "wearable",
          firmware: "v1.8.3",
          location: {
            latitude: 3.141,
            longitude: 101.6901,
            region: "Kuala Lumpur, Malaysia",
          },
          metrics: {
            heartRate: "78 bpm",
            bodyTemperature: "36.5°C",
            steps: "3,421",
            calories: "245 kcal",
            distance: "2.8 km",
            oxygenSaturation: "98%",
            stressLevel: "Low",
            sleepQuality: "Good",
          },
          sensors: [
            {
              name: "Heart Rate Monitor",
              type: "Optical",
              value: "78 bpm",
              status: "good",
            },
            {
              name: "Temperature Sensor",
              type: "Contact",
              value: "36.5°C",
              status: "good",
            },
            {
              name: "Accelerometer",
              type: "MEMS",
              value: "Active",
              status: "good",
            },
            {
              name: "SpO2 Sensor",
              type: "Optical",
              value: "98%",
              status: "good",
            },
            {
              name: "Emergency Button",
              type: "Digital input",
              value: "Not Pressed",
            },
          ],
          events: [
            {
              type: "Health",
              severity: "info",
              message: "Normal vital signs",
              time: "5 minutes ago",
            },
            {
              type: "Activity",
              severity: "info",
              message: "Activity goal reached",
              time: "1 hour ago",
            },
            {
              type: "System",
              severity: "info",
              message: "Device synced with cloud",
              time: "30 minutes ago",
            },
          ],
        }
      default:
        return {
          ...baseDevice,
          type: "sensor",
          firmware: "v2.3.1",
          location: {
            latitude: 3.139,
            longitude: 101.6869,
            region: "Kuala Lumpur, Malaysia",
          },
          metrics: {
            seismicActivity: "1.22g",
            pressure: "1029 hPa",
            temperature: "32.8°C",
            humidity: "68% RH",
            gasLevel: "0.18V (Safe)",
            soilMoisture: "73%",
            soundLevel: "-44 dB SPL",
            acceleration: "0.05g",
          },
          sensors: [
            {
              name: "Seismometer",
              type: "Simulated",
              value: "1.22g",
              status: "good",
            },
            {
              name: "GY-BMP280 (Pressure + Temp)",
              type: "I²C",
              pins: "SDA: GPIO 21, SCL: GPIO 22",
              value: "1029 hPa, 32.8°C",
              status: "good",
            },
            {
              name: "DHT11 (Humidity + Temp)",
              type: "1-wire digital",
              pins: "GPIO 4",
              value: "68% RH, 23.2°C",
              status: "good",
            },
            {
              name: "MQ-2 Gas Sensor",
              type: "Analog (ADC)",
              pins: "GPIO 34 (ADC1_CH6)",
              value: "0.18V (Safe)",
              status: "good",
            },
            {
              name: "Soil Moisture",
              type: "Analog (ADC)",
              pins: "GPIO 35 (ADC1_CH7)",
              value: "73% Moisture",
              status: "good",
            },
            {
              name: "INMP441 MEMS Microphone",
              type: "I²S",
              pins: "WS: GPIO 25, SCK: GPIO 26, SD: GPIO 27",
              value: "-44 dB SPL",
              status: "good",
            },
            {
              name: "MPU6050 (Accel/Gyro)",
              type: "I²C (shared)",
              pins: "SDA: GPIO 21, SCL: GPIO 22",
              value: "Accel: 0.05g, Gyro: 0.78°/s",
              status: "good",
            },
          ],
          events: [
            {
              type: "Connection",
              severity: "info",
              message: "Device connected to the network with strong signal.",
              time: "1 hour ago",
            },
            {
              type: "Firmware",
              severity: "info",
              message: "Device firmware updated to version v2.3.1.",
              time: "2 hours ago",
            },
            {
              type: "Sensor",
              severity: "warning",
              message: "Soil moisture level decreasing.",
              time: "3 hours ago",
            },
          ],
        }
    }
  }

  const createMockDevice = (id: string): DeviceType => {
    // Create a mock device based on the ID
    // First check if a device type can be determined from localStorage
    const cachedConnected = localStorage.getItem("hub-connected-devices")
    let deviceType = "sensor" // default type
    
    if (cachedConnected) {
      const devices = JSON.parse(cachedConnected)
      const device = devices.find((d: any) => d.id === id)
      if (device && device.type) {
        deviceType = device.type
      }
    }
    
    // Fallback to ID-based detection if no type found in localStorage
    if (deviceType === "sensor") {
      deviceType = id.includes("lora")
        ? "lora"
        : id.includes("helmet")
          ? "helmet"
          : id.includes("drone")
            ? "drone"
            : id.includes("wearable")
              ? "wearable"
              : "sensor"
    }

    // Get name from localStorage if available
    let deviceName = undefined;
    if (cachedConnected) {
      const devices = JSON.parse(cachedConnected);
      const device = devices.find((d: any) => d.id === id);
      if (device) {
        deviceName = device.name;
      }
    }

    const baseDevice = {
      id,
      name: deviceName || `${
        deviceType === "lora"
          ? "Portable Lora Node"
          : deviceType === "helmet"
            ? "Smart Emergency Helmet"
            : deviceType === "module"
              ? "Drone Modular Payload System"
              : deviceType === "wearable"
                ? "Smart Watch"
                : "Ground Node"
      } ${id.substring(0, 8)}`,
      type: deviceType,
      icon:
        deviceType === "lora"
          ? Radio
          : deviceType === "helmet"
            ? Shield // Changed from HardHat to Shield
            : deviceType === "module"
              ? Zap
              : deviceType === "wearable"
                ? Watch
                : Smartphone,
      status: "connected" as const,
      battery: Math.floor(Math.random() * 30) + 70, // 70-100%
      signal: Math.floor(Math.random() * 40) + 60, // 60-100%
      lastSeen: "10 minutes ago",
    }

    return enhanceDeviceWithMockData(baseDevice)
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

  const getBatteryStatus = (level: number) => {
    if (level > 70) return "Good - No action needed"
    if (level > 30) return "Moderate - Consider charging soon"
    return "Low - Charge immediately"
  }

  const getSignalStatus = (level: number) => {
    if (level > 70) return "Strong connection - Optimal data transmission"
    if (level > 30) return "Moderate connection - Data transmission may be affected"
    return "Weak connection - Data loss possible"
  }

  const renderDeviceIcon = (Icon: React.ElementType) => {
    return <Icon className="h-6 w-6" />
  }

  const renderMetricIcon = (metricName: string) => {
    const iconMap: Record<string, React.ElementType> = {
      seismicActivity: Waves,
      pressure: Gauge,
      temperature: Thermometer,
      humidity: Droplets,
      gasLevel: Wind,
      soilMoisture: Droplets,
      soundLevel: Microphone,
      acceleration: Activity,
      range: Radio,
      connectedNodes: Cpu,
      packetLoss: AlertTriangle,
      dataRate: Activity,
      frequency: Radio,
      txPower: Zap,
      spreadingFactor: BarChart3,
      bandwidth: Waves,
      impactDetection: AlertTriangle,
      temperatureInside: Thermometer,
      temperatureOutside: Thermometer,
      oxygenLevel: Wind,
      gasDetection: Wind,
      motionStatus: Activity,
      userStatus: Info,
      lightLevel: Zap,
      altitude: BarChart3,
      speed: Activity,
      flightTime: Clock,
      remainingTime: Clock,
      distance: MapPin,
      heading: Compass,
      windSpeed: Wind,
      missionProgress: BarChart3,
      heartRate: Heart,
      bodyTemperature: Thermometer,
      steps: Footprints,
      calories: Activity,
      oxygenSaturation: Wind,
      stressLevel: Activity,
      sleepQuality: Clock,
    }

    const Icon = iconMap[metricName] || Info
    return <Icon className="h-5 w-5" />
  }

  if (!device) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading device information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{device.name}</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              {device.status === "connected" ? "Active" : device.status}
            </Badge>
            <span className="text-sm text-gray-600 dark:text-gray-400">ID: {device.id.substring(0, 8)}</span>
          </div>
        </CardHeader>
      </Card>

      {/* Export Button */}
      <Button variant="outline" className="w-full flex items-center justify-center">
        <Download className="h-4 w-4 mr-2" />
        Export Data
      </Button>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Battery Level</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Battery className={`h-5 w-5 ${getBatteryColor(device.battery || 0)}`} />
                <span className={`text-xl font-bold ${getBatteryColor(device.battery || 0)}`}>{device.battery}%</span>
              </div>
              <Progress value={device.battery} className="w-1/2 h-2" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{getBatteryStatus(device.battery || 0)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Signal Strength</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wifi className={`h-5 w-5 ${getSignalColor(device.signal || 0)}`} />
                <span className={`text-xl font-bold ${getSignalColor(device.signal || 0)}`}>{device.signal}%</span>
              </div>
              <Progress value={device.signal} className="w-1/2 h-2" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{getSignalStatus(device.signal || 0)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Firmware</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Cpu className="h-5 w-5 text-blue-600" />
                <span className="text-xl font-bold">{device.firmware}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Latest version - Up to date</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sensors">Sensors</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Device Information</CardTitle>
              <CardDescription>Detailed information about this device</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Device Type</span>
                  <span className="font-medium">
                    {device.type === "lora"
                      ? "Portable Lora Node"
                      : device.type === "helmet"
                        ? "Smart Emergency Helmet"
                        : device.type === "drone"
                          ? "Drone Modular Payload System"
                          : device.type === "wearable"
                            ? "Smart Watch"
                            : "Ground Node"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                  <span className="font-medium">active</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Last Seen</span>
                  <span className="font-medium">{device.lastSeen}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Firmware</span>
                  <span className="font-medium">{device.firmware}</span>
                </div>

                {device.location && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Latitude</span>
                      <span className="font-medium">{device.location.latitude}° N</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Longitude</span>
                      <span className="font-medium">{device.location.longitude}° E</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {device.location && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Location</CardTitle>
                <CardDescription>Current device location</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-40 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <MapPin className="h-8 w-8 mx-auto mb-2" />
                    <p>Map view would be displayed here</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Coordinates</span>
                    <span className="font-medium">
                      {device.location.latitude}° N, {device.location.longitude}° E
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Region</span>
                    <span className="font-medium">{device.location.region}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {device.metrics && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Metrics</CardTitle>
                <CardDescription>Current readings from device sensors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(device.metrics).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">{renderMetricIcon(key)}</div>
                      <div>
                        <p className="text-sm font-medium capitalize">
                          {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="sensors" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Peripherals & Sensors</CardTitle>
              <CardDescription>All connected sensors and peripherals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {device.sensors?.map((sensor, index) => (
                <div key={index}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{sensor.name}</span>
                      <Badge
                        variant="outline"
                        className={
                          sensor.status === "good"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                        }
                      >
                        {sensor.status === "good" ? "Operational" : "Status"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{sensor.type}</p>
                    {sensor.pins && <p className="text-xs text-gray-500 dark:text-gray-500">Pins: {sensor.pins}</p>}
                    <p className="text-sm font-medium">{sensor.value}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity Timeline</CardTitle>
              <CardDescription>Recent events and activities for this device</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {device.events?.map((event, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div
                    className={`mt-1 p-1 rounded-full ${
                      event.severity === "info"
                        ? "bg-blue-100 dark:bg-blue-900"
                        : event.severity === "warning"
                          ? "bg-yellow-100 dark:bg-yellow-900"
                          : "bg-red-100 dark:bg-red-900"
                    }`}
                  >
                    {event.severity === "info" ? (
                      <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    ) : event.severity === "warning" ? (
                      <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{event.type}</span>
                      <Badge
                        variant="outline"
                        className={
                          event.severity === "info"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : event.severity === "warning"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }
                      >
                        {event.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{event.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{event.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Device Settings</CardTitle>
              <CardDescription>Configure device parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-connect</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Automatically connect when in range</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Power Saving Mode</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Reduce power consumption</p>
                </div>
                <Switch />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Data Logging</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Record sensor data</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alert Notifications</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Receive alerts from this device</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Save Settings</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-red-600 dark:text-red-500">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="destructive" className="w-full">
                Reset Device
              </Button>
              <Button variant="outline" className="w-full border-red-600 text-red-600 hover:bg-red-50">
                Unpair Device
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
