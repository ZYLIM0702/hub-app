"use client"

import { useState, useEffect } from "react"
import { MapPin, Navigation, Users, Phone, Star, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export function SheltersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newShelter, setNewShelter] = useState({
    name: "",
    address: "",
    capacity: "",
    phone: "",
    amenities: "",
    status: "Open"
  })

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.log("Error getting location:", error)
          // Fallback to default location (Kuala Lumpur)
          setUserLocation({ lat: 3.139, lng: 101.6869 })
        },
      )
    } else {
      // Fallback to default location
      setUserLocation({ lat: 3.139, lng: 101.6869 })
    }
  }, [])

  const shelters = [
    {
      id: 1,
      name: "Pusat Komuniti Sentral",
      address: "Jalan Tun Sambanthan, Brickfields, Kuala Lumpur",
      distance: "1.3 km",
      capacity: 200,
      available: 45,
      amenities: ["Food", "Medical", "WiFi", "Pet-friendly"],
      phone: "+60 3-1234 5678",
      rating: 4.5,
      status: "Open",
      lat: 3.1343,
      lng: 101.6864,
    },
    {
      id: 2,
      name: "Dewan Serbaguna Flat Sri Labuan",
      address: "Bandar Tun Razak, Kuala Lumpur",
      distance: "1.9 km",
      capacity: 150,
      available: 89,
      amenities: ["Food", "Restrooms", "Parking"],
      phone: "+60 3-2345 6789",
      rating: 4.2,
      status: "Open",
      lat: 3.0945,
      lng: 101.7228,
    },
    {
      id: 3,
      name: "St. Mary's Cathedral Hall",
      address: "Jalan Raja, Kuala Lumpur",
      distance: "3.4 km",
      capacity: 100,
      available: 12,
      amenities: ["Food", "Medical", "Childcare"],
      phone: "+60 3-3456 7890",
      rating: 4.7,
      status: "Nearly Full",
      lat: 3.1502,
      lng: 101.6934,
    },
    {
      id: 4,
      name: "Titiwangsa Recreational Centre",
      address: "Jalan Kuantan, Titiwangsa, Kuala Lumpur",
      distance: "5.6 km",
      capacity: 300,
      available: 0,
      amenities: ["Food", "Medical", "WiFi", "Showers"],
      phone: "+60 3-4567 8901",
      rating: 4.3,
      status: "Full",
      lat: 3.1826,
      lng: 101.7036,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-green-100 text-green-800"
      case "Nearly Full":
        return "bg-yellow-100 text-yellow-800"
      case "Full":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredShelters = shelters.filter(
    (shelter) =>
      shelter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shelter.address.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleGetDirections = (shelter: any) => {
    if (userLocation) {
      const url = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_foot&route=${userLocation.lat}%2C${userLocation.lng}%3B${shelter.lat}%2C${shelter.lng}`
      window.open(url, "_blank")
    } else {
      // Fallback to just showing the location
      const url = `https://www.openstreetmap.org/?mlat=${shelter.lat}&mlon=${shelter.lng}&zoom=15`
      window.open(url, "_blank")
    }
  }

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  const handleSubmitShelter = (e: React.FormEvent) => {
    e.preventDefault()
    // This is just a prototype - in a real app, this would send data to a backend
    alert(`New shelter submission received:
Name: ${newShelter.name}
Address: ${newShelter.address}
Capacity: ${newShelter.capacity}
Phone: ${newShelter.phone}
Amenities: ${newShelter.amenities}
    `)
    setIsDialogOpen(false)
    setNewShelter({
      name: "",
      address: "",
      capacity: "",
      phone: "",
      amenities: "",
      status: "Open"
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">Emergency Shelters</h1>
        <Input
          placeholder="Search shelters by name or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      {/* OpenStreetMap */}
      <Card className="dark:bg-gray-900">
        <CardContent className="p-4">
          <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            {userLocation ? (
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${userLocation.lng - 0.02}%2C${
                  userLocation.lat - 0.02
                }%2C${userLocation.lng + 0.02}%2C${
                  userLocation.lat + 0.02
                }&layer=mapnik&marker=${userLocation.lat}%2C${userLocation.lng}`}
                style={{ border: 0 }}
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <MapPin className="h-8 w-8 mx-auto mb-2" />
                  <p>Loading map...</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Shelter List */}
      <div className="space-y-4">
        {filteredShelters.map((shelter) => (
          <Card key={shelter.id} className="dark:bg-gray-900">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{shelter.name}</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{shelter.address}</p>
                </div>
                <Badge className={getStatusColor(shelter.status)}>{shelter.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Distance and Capacity */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1">
                  <Navigation className="h-4 w-4 text-blue-600" />
                  <span>{shelter.distance} away</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4 text-green-600" />
                  <span>
                    {shelter.available}/{shelter.capacity} available
                  </span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">{shelter.rating}</span>
                <span className="text-sm text-gray-500">rating</span>
              </div>

              {/* Amenities */}
              <div>
                <p className="text-sm font-medium mb-2">Amenities:</p>
                <div className="flex flex-wrap gap-1">
                  {shelter.amenities.map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button
                  className="flex-1"
                  disabled={shelter.status === "Full"}
                  onClick={() => handleGetDirections(shelter)}
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleCall(shelter.phone)}>
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Shelter Button */}
      <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-900">
        <CardContent className="p-6 text-center">
          <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400 mb-3">Know of a shelter not listed?</p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add New Shelter
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Shelter</DialogTitle>
                <DialogDescription>
                  Fill in the details of the shelter you want to add.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitShelter} className="grid gap-4">
                <div>
                  <Label htmlFor="shelter-name">Shelter Name</Label>
                  <Input
                    id="shelter-name"
                    placeholder="Enter shelter name"
                    value={newShelter.name}
                    onChange={(e) => setNewShelter({ ...newShelter, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="shelter-address">Address</Label>
                  <Input
                    id="shelter-address"
                    placeholder="Enter shelter address"
                    value={newShelter.address}
                    onChange={(e) => setNewShelter({ ...newShelter, address: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="shelter-phone">Phone Number</Label>
                  <Input
                    id="shelter-phone"
                    placeholder="Enter phone number"
                    value={newShelter.phone}
                    onChange={(e) => setNewShelter({ ...newShelter, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="shelter-capacity">Capacity</Label>
                  <Input
                    id="shelter-capacity"
                    placeholder="Enter capacity"
                    value={newShelter.capacity}
                    onChange={(e) => setNewShelter({ ...newShelter, capacity: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="shelter-amenities">Amenities</Label>
                  <Input
                    id="shelter-amenities"
                    placeholder="Enter amenities (comma separated)"
                    value={newShelter.amenities}
                    onChange={(e) => setNewShelter({ ...newShelter, amenities: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="shelter-status">Status</Label>
                  <select
                    id="shelter-status"
                    className="w-full"
                    value={newShelter.status}
                    onChange={(e) => setNewShelter({ ...newShelter, status: e.target.value })}
                  >
                    <option value="Open">Open</option>
                    <option value="Nearly Full">Nearly Full</option>
                    <option value="Full">Full</option>
                  </select>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => console.log("Shelter added!")}>
                    Add Shelter
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}
