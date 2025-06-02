"use client"

import { useState } from "react"
import { Heart, Users, Calendar, Plus, Search, Filter, Share2 } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"

type Campaign = {
  id: string
  title: string
  description: string
  organizer: string
  raised: number
  goal: number
  donors: number
  daysLeft: number
  category: string
  image?: string
  isUrgent?: boolean
  isVerified?: boolean
}

export function CrowdfundingPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "camp-001",
      title: "Emergency Shelter Supplies",
      description:
        "Help provide tents, blankets, and basic necessities for families displaced by the recent earthquake.",
      organizer: "Disaster Relief Coalition",
      raised: 15750,
      goal: 25000,
      donors: 342,
      daysLeft: 5,
      category: "Shelter",
      isUrgent: true,
      isVerified: true,
    },
    {
      id: "camp-002",
      title: "Medical Aid for Flood Victims",
      description:
        "Support medical teams providing emergency care to those affected by flooding in the eastern region.",
      organizer: "Medical Response Team",
      raised: 8920,
      goal: 12000,
      donors: 178,
      daysLeft: 3,
      category: "Medical",
      isUrgent: true,
      isVerified: true,
    },
    {
      id: "camp-003",
      title: "Clean Water Initiative",
      description: "Help restore clean water access to communities affected by infrastructure damage.",
      organizer: "Water Relief Network",
      raised: 5340,
      goal: 10000,
      donors: 112,
      daysLeft: 7,
      category: "Water",
      isVerified: true,
    },
    {
      id: "camp-004",
      title: "School Rebuilding Project",
      description: "Support the reconstruction of schools damaged during the recent natural disaster.",
      organizer: "Education First Foundation",
      raised: 23400,
      goal: 50000,
      donors: 267,
      daysLeft: 14,
      category: "Education",
      isVerified: true,
    },
    {
      id: "camp-005",
      title: "Emergency Communications Network",
      description: "Help deploy emergency communication equipment to restore connectivity in affected areas.",
      organizer: "Tech Response Team",
      raised: 12800,
      goal: 15000,
      donors: 203,
      daysLeft: 2,
      category: "Technology",
      isUrgent: true,
    },
  ])

  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getProgressColor = (raised: number, goal: number) => {
    const percentage = (raised / goal) * 100
    if (percentage >= 90) return "bg-green-600"
    if (percentage >= 50) return "bg-blue-600"
    return "bg-orange-600"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Crowdfunding</h1>
        <p className="text-gray-600 dark:text-gray-400">Support disaster relief efforts and community rebuilding</p>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Search campaigns..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="urgent">Urgent</TabsTrigger>
          <TabsTrigger value="verified">Verified</TabsTrigger>
          <TabsTrigger value="nearby">Nearby</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Campaign Cards */}
      <div className="space-y-4">
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign.id} className="overflow-hidden">
            {campaign.image ? (
              <div className="h-40 bg-gray-200 dark:bg-gray-800">
                <img
                  src={campaign.image || "/placeholder.svg"}
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="h-40 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                <Heart className="h-12 w-12 text-gray-400 dark:text-gray-600" />
              </div>
            )}
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{campaign.title}</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">by {campaign.organizer}</p>
                </div>
                <div className="flex space-x-1">
                  {campaign.isUrgent && <Badge variant="destructive">Urgent</Badge>}
                  {campaign.isVerified && (
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">{campaign.description}</p>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">${campaign.raised.toLocaleString()}</span>
                  <span className="text-gray-600 dark:text-gray-400">of ${campaign.goal.toLocaleString()}</span>
                </div>
                <Progress
                  value={(campaign.raised / campaign.goal) * 100}
                  className={`h-2 ${getProgressColor(campaign.raised, campaign.goal)}`}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>{campaign.donors} donors</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{campaign.daysLeft} days left</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Badge variant="outline" className="text-xs h-5">
                    {campaign.category}
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex space-x-2">
              <Button className="flex-1" onClick={() => router.push(`/donate/${campaign.id}`)}>
                <Heart className="h-4 w-4 mr-2" />
                Donate
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No campaigns found matching your search.</p>
          </div>
        )}
      </div>

      {/* Create Campaign Button */}
      <div className="fixed bottom-20 right-4">
        <Button size="lg" className="rounded-full h-14 w-14 shadow-lg">
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
