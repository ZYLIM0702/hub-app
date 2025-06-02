"use client"

import { useState, useRef, useEffect } from "react"
import {
  Send,
  Radio,
  MoreVertical,
  ChevronLeft,
  Wifi,
  WifiOff,
  Clock,
  Check,
  CheckCheck,
  AlertTriangle,
  Paperclip,
  ImageIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import Link from "next/link"

type Message = {
  id: string
  text: string
  sender: string
  senderName: string
  timestamp: Date
  status: "sent" | "delivered" | "read" | "failed" | "pending"
  isLora: boolean
}

type Contact = {
  id: string
  name: string
  avatar?: string
  status: "online" | "offline" | "lora-only"
  lastSeen?: Date
  unreadCount?: number
  lastMessage?: string
  signalStrength?: number
}

export function LoraChat() {
  const [activeChat, setActiveChat] = useState<Contact | null>(null)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [allMessages, setAllMessages] = useState<Record<string, Message[]>>({})

  useEffect(() => {
    // Load cached data from localStorage
    const cachedContacts = localStorage.getItem("hub-lora-contacts")
    const cachedMessages = localStorage.getItem("hub-lora-messages")

    if (cachedContacts) {
      setContacts(JSON.parse(cachedContacts))
    } else {
      // Set default contacts if no cache
      const defaultContacts = [
        {
          id: "user1",
          name: "Puan Aminah",
          status: "online" as const,
          lastMessage: "Saya di pusat pemindahan Sg. Buloh (I'm at Sg. Buloh relief center)",
          unreadCount: 2,
          signalStrength: 85,
        },
        {
          id: "user2",
          name: "En. Raju",
          status: "lora-only" as const,
          lastMessage: "Signal lemah di sini (Signal is weak here)",
          signalStrength: 45,
        },
        {
          id: "user3",
          name: "SMART Team Selangor",
          status: "online" as const,
          lastMessage: "Bergerak ke Sektor 3 (Moving to Sector 3)",
          signalStrength: 90,
        },
        {
          id: "user4",
          name: "Unit Perubatan KKM",
          status: "offline" as const,
          lastSeen: new Date(Date.now() - 3600000),
          lastMessage: "Perlukan bekalan di kem utama (Need supplies at main camp)",
          signalStrength: 0,
        },
        {
          id: "user5",
          name: "JKM Command Center",
          status: "online" as const,
          lastMessage: "Status update pada 1800",
          signalStrength: 95,
        },
      ]
      setContacts(defaultContacts)
      localStorage.setItem("hub-lora-contacts", JSON.stringify(defaultContacts))
    }

    if (cachedMessages) {
      const parsedMessages = JSON.parse(cachedMessages)
      // Convert timestamp strings back to Date objects
      const convertedMessages = Object.keys(parsedMessages).reduce((acc, key) => {
        acc[key] = parsedMessages[key].map((msg: Message) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
        return acc
      }, {} as Record<string, Message[]>)
      setAllMessages(convertedMessages)
    }
  }, [])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (activeChat) {
      // Load messages for this chat from cache or create default
      const chatMessages = allMessages[activeChat.id] || [
        {
          id: "msg1",
          text: "Assalamualaikum, boleh tolong? Kami perlukan bantuan. (We need assistance)",
          sender: activeChat.id,
          senderName: activeChat.name,
          timestamp: new Date(Date.now() - 3600000),
          status: "read" as const,
          isLora: activeChat.status === "lora-only",
        },
        {
          id: "msg2",
          text: "Ya, saya di sini. Di mana lokasi anda? (Yes, I'm here. What's your location?)",
          sender: "me",
          senderName: "You",
          timestamp: new Date(Date.now() - 3500000),
          status: "read" as const,
          isLora: false,
        },
        {
          id: "msg3",
          text: "Kami di SK Sri Muda. Signal tak berapa kuat. (We're at SK Sri Muda. Signal is weak.)",
          sender: activeChat.id,
          senderName: activeChat.name,
          timestamp: new Date(Date.now() - 3400000),
          status: "read" as const,
          isLora: activeChat.status === "lora-only",
        },
        {
          id: "msg4",
          text: "Baik, saya hantar pasukan sekarang. Berapa ramai orang bersama anda? (I'll send a team now. How many people are with you?)",
          sender: "me",
          senderName: "You",
          timestamp: new Date(Date.now() - 3300000),
          status: "delivered" as const,
          isLora: false,
        },
      ]

      if (activeChat.status === "lora-only" && !allMessages[activeChat.id]) {
        chatMessages.push({
          id: "msg5",
          text: "Lebih kurang 12 orang. Ada yang perlukan rawatan perubatan. (About 12 people. Some need medical attention.)",
          sender: activeChat.id,
          senderName: activeChat.name,
          timestamp: new Date(Date.now() - 3200000),
          status: "read" as const,
          isLora: true,
        })
      }

      setMessages(chatMessages)

      // Cache default messages if not already cached
      if (!allMessages[activeChat.id]) {
        const newAllMessages = { ...allMessages, [activeChat.id]: chatMessages }
        setAllMessages(newAllMessages)
        localStorage.setItem("hub-lora-messages", JSON.stringify(newAllMessages))
      }
    } else {
      setMessages([])
    }
  }, [activeChat, allMessages])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (!message.trim() || !activeChat) return

    // Add new message
    const newMessage: Message = {
      id: `msg${Date.now()}`,
      text: message,
      sender: "me",
      senderName: "You",
      timestamp: new Date(),
      status: "pending",
      isLora: false,
    }

    const updatedMessages = [...messages, newMessage]
    setMessages(updatedMessages)

    // Update cached messages
    const newAllMessages = { ...allMessages, [activeChat.id]: updatedMessages }
    setAllMessages(newAllMessages)
    localStorage.setItem("hub-lora-messages", JSON.stringify(newAllMessages))

    // Update contact's last message
    const updatedContacts = contacts.map((contact) =>
      contact.id === activeChat.id ? { ...contact, lastMessage: message, unreadCount: 0 } : contact,
    )
    setContacts(updatedContacts)
    localStorage.setItem("hub-lora-contacts", JSON.stringify(updatedContacts))

    setMessage("")

    // Simulate message status updates
    setTimeout(() => {
      const statusUpdatedMessages = updatedMessages.map((msg) =>
        msg.id === newMessage.id ? { ...msg, status: "sent" as const } : msg,
      )
      setMessages(statusUpdatedMessages)

      const newAllMessagesWithStatus = { ...allMessages, [activeChat.id]: statusUpdatedMessages }
      setAllMessages(newAllMessagesWithStatus)
      localStorage.setItem("hub-lora-messages", JSON.stringify(newAllMessagesWithStatus))

      // For LoRa connections, simulate slower delivery
      const deliveryTime = activeChat.status === "lora-only" ? 2000 : 1000

      setTimeout(() => {
        const deliveredMessages = statusUpdatedMessages.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "delivered" as const } : msg,
        )
        setMessages(deliveredMessages)

        const finalAllMessages = { ...allMessages, [activeChat.id]: deliveredMessages }
        setAllMessages(finalAllMessages)
        localStorage.setItem("hub-lora-messages", JSON.stringify(finalAllMessages))
      }, deliveryTime)
    }, 500)
  }

  const getSignalStrengthIndicator = (strength?: number) => {
    if (!strength || strength === 0) {
      return <WifiOff className="h-4 w-4 text-gray-400" />
    }

    if (strength > 70) {
      return (
        <div className="flex items-center space-x-1">
          <Wifi className="h-4 w-4 text-green-600" />
          <span className="text-xs text-green-600">{strength}%</span>
        </div>
      )
    }

    if (strength > 30) {
      return (
        <div className="flex items-center space-x-1">
          <Wifi className="h-4 w-4 text-yellow-600" />
          <span className="text-xs text-yellow-600">{strength}%</span>
        </div>
      )
    }

    return (
      <div className="flex items-center space-x-1">
        <Wifi className="h-4 w-4 text-red-600" />
        <span className="text-xs text-red-600">{strength}%</span>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <Check className="h-3 w-3 text-gray-400" />
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-gray-400" />
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-600" />
      case "failed":
        return <AlertTriangle className="h-3 w-3 text-red-600" />
      case "pending":
        return <Clock className="h-3 w-3 text-gray-400" />
      default:
        return null
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-600">Online</Badge>
      case "lora-only":
        return <Badge className="bg-blue-600">LoRa Only</Badge>
      case "offline":
        return (
          <Badge variant="outline" className="text-gray-600">
            Offline
          </Badge>
        )
      default:
        return null
    }
  }

  const clearCache = () => {
    localStorage.removeItem("hub-lora-contacts")
    localStorage.removeItem("hub-lora-messages")
    window.location.reload()
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {activeChat ? (
        <>
          {/* Chat Header */}
          <div className="flex items-center justify-between p-2 border-b">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" onClick={() => setActiveChat(null)}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Avatar>
                <AvatarFallback>{activeChat.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-medium text-sm">{activeChat.name}</h2>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(activeChat.status)}
                  {getSignalStrengthIndicator(activeChat.signalStrength)}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeChat.status === "lora-only" && (
              <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg text-center text-sm mb-4">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <Radio className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">LoRa Connection Active</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Messages may be delayed. Limited to text only.
                </p>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex", msg.sender === "me" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg p-3 space-y-1",
                    msg.sender === "me"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                    msg.isLora &&
                      msg.sender !== "me" &&
                      "bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800",
                  )}
                >
                  <p className="text-sm">{msg.text}</p>
                  <div className="flex items-center justify-end space-x-1">
                    <span className="text-xs opacity-70">{formatTime(msg.timestamp)}</span>
                    {msg.sender === "me" && getStatusIcon(msg.status)}
                    {msg.isLora && msg.sender !== "me" && <Radio className="h-3 w-3 text-blue-600 ml-1" />}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-2 border-t">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="pr-20"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button onClick={handleSendMessage} disabled={!message.trim() || activeChat.status === "offline"}>
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {activeChat.status === "lora-only" && (
              <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400 flex items-center justify-center">
                <Radio className="h-3 w-3 mr-1" />
                LoRa mode: Text messages only • {activeChat.signalStrength}% signal
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Contacts List */}
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-xl font-bold">LoRa Chat</h1>
            <div className="flex items-center space-x-2">
              <Badge className="bg-blue-600">
                <Radio className="h-5 w-5 text-blue-600" />
                LoRa Active
              </Badge>
              <Button variant="ghost" size="sm" onClick={clearCache} className="text-xs">
                Clear Cache
              </Button>
            </div>
          </div>

          <div className="p-4">
            <Card className="bg-blue-50 dark:bg-blue-950 mb-4">
              <CardContent className="p-4 text-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <Radio className="h-5 w-5 text-blue-600" />
                  <h3 className="font-medium">LoRa Network Status</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Network Status:</span>
                    <Badge className="bg-green-600">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Connected Nodes:</span>
                    <span className="font-medium">4</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Signal Range:</span>
                    <span className="font-medium">~2.5 km</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-2">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setActiveChat(contact)}
                  className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-700"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{contact.name}</h3>
                        {contact.status === "lora-only" && <Radio className="h-3 w-3 text-blue-600" />}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">{contact.lastMessage}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    {getSignalStrengthIndicator(contact.signalStrength)}
                    {contact.unreadCount ? (
                      <Badge className="bg-red-600 text-white">{contact.unreadCount}</Badge>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-t">
            <Link href="/devices">
              <Button variant="outline" className="w-full">
                <Radio className="h-4 w-4 mr-2" />
                Manage LoRa Devices
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
