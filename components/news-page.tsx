"use client"

import { useState } from "react"
import {
  Newspaper,
  AlertTriangle,
  Clock,
  MapPin,
  Camera,
  Mic,
  Search,
  Filter,
  Share2,
  Bookmark,
  BookmarkCheck,
} from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type NewsItem = {
  id: string
  title: string
  content: string
  source: string
  author?: string
  time: string
  location: string
  category: "alert" | "update" | "report" | "community"
  image?: string
  isOfficial?: boolean
  isUrgent?: boolean
  isSaved?: boolean
}

export function NewsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [newsItems, setNewsItems] = useState<NewsItem[]>([
    {
      id: "news-001",
      title: "Earthquake Aftershock Warning",
      content:
        "Authorities warn of potential aftershocks in the next 24-48 hours. Residents should prepare and avoid damaged buildings.",
      source: "Emergency Management Agency",
      time: "10 minutes ago",
      location: "Central District",
      category: "alert",
      isOfficial: true,
      isUrgent: true,
      image: "https://preview.redd.it/history-of-south-east-asia-earthquakes-from-1-jan-1975-to-v0-hcj5ba8d4ure1.jpeg?width=1080&crop=smart&auto=webp&s=5ea9ffe65e7812d27dd990de7fc11edf13ae7784",
    },
    {
      id: "news-002",
      title: "New Shelter Opens at Community Center",
      content:
        "A new emergency shelter with capacity for 200 people has opened at the Central Community Center. Hot meals and medical services available.",
      source: "Relief Coordination",
      time: "1 hour ago",
      location: "Downtown Area",
      category: "update",
      isOfficial: true,
      image: "https://cdnuploads.aa.com.tr/uploads/Contents/2018/10/14/thumbs_b_c_cce1c2d80109c62b236b6df70ea59d3a.jpg?v=121044",
    },
    {
      id: "news-003",
      title: "Road Closures Update",
      content:
        "Main Street Bridge remains closed due to structural concerns. Engineers are assessing damage. Use alternate routes via Highway 7.",
      source: "Transportation Department",
      time: "2 hours ago",
      location: "River District",
      category: "update",
      isOfficial: true,
      image: "https://cdn.i-scmp.com/sites/default/files/d8/images/canvas/2025/05/20/2d8a70eb-4955-47c4-a004-6aea7e17845f_02917f7f.jpg",
    },
    {
      id: "news-004",
      title: "Volunteer Group Distributing Supplies",
      content:
        "Local volunteer group 'Neighbors Help' is distributing water, food, and hygiene supplies at the North Park entrance from 2-6 PM today.",
      source: "Community Report",
      author: "Maria Chen",
      time: "3 hours ago",
      location: "North Park",
      category: "community",
      image: "https://img.freepik.com/premium-photo/volunteer-group-distributing-food-supplies-community_1286780-3605.jpg",
    },
    {
      id: "news-005",
      title: "Power Restoration Progress",
      content:
        "Utility crews have restored power to 60% of affected areas. Estimated full restoration within 48 hours for remaining areas.",
      source: "Power Company",
      time: "5 hours ago",
      location: "Multiple Areas",
      category: "update",
      isOfficial: true,
      image: "https://cdn.entergynewsroom.com/userfiles/ZetaNR110120.jpg",
    },
  ])

  const toggleSaved = (id: string) => {
    setNewsItems(newsItems.map((item) => (item.id === id ? { ...item, isSaved: !item.isSaved } : item)))
  }

  const filteredNews = newsItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "alert":
        return <Badge variant="destructive">Alert</Badge>
      case "update":
        return <Badge variant="default">Update</Badge>
      case "report":
        return <Badge variant="secondary">Report</Badge>
      case "community":
        return <Badge variant="outline">Community</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">News & Updates</h1>
        <p className="text-gray-600 dark:text-gray-400">Stay informed with the latest emergency information</p>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Search news..."
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
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="updates">Updates</TabsTrigger>
          <TabsTrigger value="official">Official</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* News Items */}
      <div className="space-y-4">
        {filteredNews.map((item) => (
          <Card key={item.id} className={item.isUrgent ? "border-red-300 dark:border-red-700" : ""}>
            {item.image && (
              <div className="h-40 bg-gray-200 dark:bg-gray-800">
                <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
              </div>
            )}
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    {getCategoryBadge(item.category)}
                    {item.isOfficial && (
                      <Badge
                        variant="outline"
                        className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        Official
                      </Badge>
                    )}
                    {item.isUrgent && (
                      <Badge variant="destructive" className="animate-pulse">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Urgent
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleSaved(item.id)}
                  className={item.isSaved ? "text-yellow-500" : "text-gray-400"}
                >
                  {item.isSaved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">{item.content}</p>

              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{item.time}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{item.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {item.author ? (
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-xs">{item.author[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs">{item.author}</span>
                    </div>
                  ) : (
                    <span className="text-xs font-medium">{item.source}</span>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex space-x-2">
              <Button variant="outline" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="icon">
                <Newspaper className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}

        {filteredNews.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No news items found matching your search.</p>
          </div>
        )}
      </div>

      {/* Report News Button */}
      <div className="fixed bottom-20 right-4 flex flex-col space-y-2">
        <Button size="icon" className="rounded-full h-12 w-12 shadow-lg bg-blue-600 hover:bg-blue-700">
          <Mic className="h-5 w-5" />
        </Button>
        <Button size="icon" className="rounded-full h-12 w-12 shadow-lg">
          <Camera className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
