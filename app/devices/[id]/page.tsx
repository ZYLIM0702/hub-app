"use client"

import { useState } from "react"
import { DeviceDetails } from "@/components/device-details"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function DeviceDetailsPage({ params }: { params: { id: string } }) {
  const [deviceInfo, setDeviceInfo] = useState<any>(null)

  return (
      <DeviceDetails 
        deviceId={params.id} 
        onDeviceLoad={setDeviceInfo}
      />
  )
}
