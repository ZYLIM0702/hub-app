import { DonatePage } from "@/components/donate-page"

export default function DonatePageRoute({ params }: { params: { campaignId: string } }) {
  return (
      <DonatePage campaignId={params.campaignId} />
  )
}
