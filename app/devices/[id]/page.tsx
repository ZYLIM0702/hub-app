import { MobileLayout } from "@/components/mobile-layout"
import { DeviceDetails } from "@/components/device-details"

export default function DeviceDetailsPage({ params }: { params: { id: string } }) {
  return (
    <MobileLayout>
      <DeviceDetails deviceId={params.id} />
    </MobileLayout>
  )
}
