import { MobileLayout } from "@/components/mobile-layout"
import { DonatePage } from "@/components/donate-page"

export default function DonatePageRoute({ params }: { params: { campaignId: string } }) {
  return (
    <MobileLayout>
      <DonatePage campaignId={params.campaignId} />
    </MobileLayout>
  )
}
