"use client"

import { useState, useEffect, useRef } from "react"
import { Shield, Phone, User, AlertTriangle, Share2, Copy, Check, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

const settings = { iconSize: "medium" } // Declare the settings variable

export function EmergencySOS() {
  const [sosActive, setSosActive] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [copiedContact, setCopiedContact] = useState<string | null>(null)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const soundIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const vibrationIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Initialize AudioContext
    if (typeof window !== 'undefined') {
      setAudioContext(new (window.AudioContext || (window as any).webkitAudioContext)())
    }
  }, [])

  // Clear intervals on unmount
  useEffect(() => {
    return () => {
      if (soundIntervalRef.current) clearInterval(soundIntervalRef.current)
      if (vibrationIntervalRef.current) clearInterval(vibrationIntervalRef.current)
    }
  }, [])

  const playEmergencySound = () => {
    if (audioContext) {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime) // Start at 800Hz

      gainNode.gain.setValueAtTime(1, audioContext.currentTime)

      // Create a repeating beep pattern
      const beepLength = 0.3 // seconds
      const beepInterval = 0.5 // seconds
      const numBeeps = 5

      for (let i = 0; i < numBeeps; i++) {
        const startTime = audioContext.currentTime + (i * beepInterval)
        gainNode.gain.setValueAtTime(1, startTime)
        gainNode.gain.setValueAtTime(0, startTime + beepLength)
      }

      oscillator.start()
      oscillator.stop(audioContext.currentTime + (numBeeps * beepInterval))
    }
  }

  const startContinuousSound = () => {
    // Play initial sound
    playEmergencySound()
    // Set up interval to play sound every 3 seconds
    soundIntervalRef.current = setInterval(playEmergencySound, 3000)
  }

  const triggerVibration = () => {
    if ('vibrate' in navigator) {
      // Vibrate for 2 seconds, pause for 0.5 seconds, repeat 3 times
      navigator.vibrate([2000, 500, 2000, 500, 2000])
    }
  }

  const startContinuousVibration = () => {
    if ('vibrate' in navigator) {
      // Set up interval to trigger vibration pattern every 3 seconds
      vibrationIntervalRef.current = setInterval(() => {
        navigator.vibrate([1000, 500, 1000])
      }, 3000)
    }
  }

  const emergencyContacts = [
    { name: "Emergency Services (999)", number: "999", type: "emergency" },
    { name: "Police Direct Line", number: "+60322662222", type: "emergency" },
    { name: "Civil Defense (JPAM)", number: "03-8064 2400", type: "emergency" },
    { name: "Talian Kasih Hotline", number: "15999", type: "emergency" },
    { name: "Befrienders KL", number: "03-7956 8145", type: "emergency" },
  ]

  const getIconSize = () => {
    switch (settings.iconSize) {
      case "small":
        return "scale-75"
      case "large":
        return "scale-150"
      default:
        return ""
    }
  }

  const handleSOSPress = () => {
    setSosActive(true)
    setCountdown(10)

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          // Start continuous sound and vibration
          startContinuousSound()
          startContinuousVibration()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleCancel = () => {
    setSosActive(false)
    setCountdown(0)
    // Force reload the window to stop all audio and vibration
    window.location.reload()
  }

  const handleCall = (number: string) => {
    try {
      // For mobile devices, use tel: protocol
      if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        window.location.href = `tel:${number}`
      } else {
        // For desktop, show instructions or try to open default phone app
        const confirmed = confirm(
          `Call ${number}?\n\nOn desktop, this will attempt to open your default phone application. On mobile devices, this will initiate a call directly.`,
        )
        if (confirmed) {
          // Try multiple approaches for desktop
          try {
            // Method 1: Direct tel: link
            window.open(`tel:${number}`, "_self")
          } catch (error) {
            try {
              // Method 2: Create temporary link and click it
              const link = document.createElement("a")
              link.href = `tel:${number}`
              link.style.display = "none"
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            } catch (error2) {
              // Method 3: Copy number to clipboard as fallback
              navigator.clipboard
                .writeText(number)
                .then(() => {
                  alert(`Phone number ${number} copied to clipboard. Please dial manually.`)
                })
                .catch(() => {
                  alert(`Please dial: ${number}`)
                })
            }
          }
        }
      }
    } catch (error) {
      console.error("Error initiating call:", error)
      // Fallback: copy to clipboard
      try {
        navigator.clipboard
          .writeText(number)
          .then(() => {
            alert(`Phone number ${number} copied to clipboard. Please dial manually.`)
          })
          .catch(() => {
            alert(`Please dial: ${number}`)
          })
      } catch (clipboardError) {
        alert(`Please dial: ${number}`)
      }
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: "Emergency Contact Information",
      text: `Emergency Contacts:\n${emergencyContacts
        .map((contact) => `${contact.name}: ${contact.number}`)
        .join("\n")}`,
    }

    try {
      if (navigator.share && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        await navigator.share(shareData)
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareData.text)
        setCopiedContact("all")
        setTimeout(() => setCopiedContact(null), 2000)
      }
    } catch (err) {
      console.log("Error sharing:", err)
      // Final fallback: show alert with text
      alert(shareData.text)
    }
  }

  const copyContact = async (contact: string, number: string) => {
    try {
      await navigator.clipboard.writeText(`${contact}: ${number}`)
      setCopiedContact(number)
      setTimeout(() => setCopiedContact(null), 2000)
    } catch (err) {
      console.log("Error copying:", err)
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = `${contact}: ${number}`
      textArea.style.position = "fixed"
      textArea.style.left = "-999999px"
      textArea.style.top = "-999999px"
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        document.execCommand("copy")
        setCopiedContact(number)
        setTimeout(() => setCopiedContact(null), 2000)
      } catch (err2) {
        alert(`${contact}: ${number}`)
      }
      document.body.removeChild(textArea)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-2 tts-enabled">Emergency SOS</h1>
        <p className="text-gray-600 tts-enabled">Press and hold the button below to send an emergency alert</p>
      </div>

      {/* SOS Button */}
      <div className="flex justify-center">
        <div className="relative">
          <Button
            size="lg"
            className={`w-48 h-48 rounded-full text-white font-bold text-xl ${
              sosActive ? "bg-red-700 animate-pulse" : "bg-red-600 hover:bg-red-700 active:scale-95"
            } transition-all duration-200 tts-enabled`}
            onMouseDown={handleSOSPress}
            disabled={sosActive}
            data-tts-text={
              sosActive ? `Sending SOS in ${countdown} seconds` : "Emergency SOS Button - Press and hold to activate"
            }
          >
            <div className="flex flex-col items-center">
              <Shield className={`h-12 w-12 mb-2 ${getIconSize()}`} />
              {sosActive ? (
                <>
                  <span>SENDING SOS</span>
                  <span className="text-3xl font-mono">{countdown}</span>
                </>
              ) : (
                <span>
                  EMERGENCY
                  <br />
                  SOS
                </span>
              )}
            </div>
          </Button>
        </div>
      </div>

      {sosActive && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="border-red-600 text-red-600 hover:bg-red-50 tts-enabled"
            data-tts-text="Cancel SOS"
          >
            Cancel SOS
          </Button>
        </div>
      )}

      {/* Emergency Info */}
      <Card className="dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 tts-enabled">
            <User className={`h-5 w-5 ${getIconSize()}`} />
            <span>Your Emergency Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400 tts-enabled">Name:</span>
            <span className="font-medium tts-enabled">John Lee</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400 tts-enabled">Role:</span>
            <span className="font-medium tts-enabled">Volunteer</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400 tts-enabled">Emergency Contact:</span>
            <span className="font-medium tts-enabled">Sarah Lee (+60 11-987 6543)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400 tts-enabled">Medical Info:</span>
            <div className="flex gap-2">
              <Badge variant="secondary" className="tts-enabled" data-tts-text="Medical condition: Type 2 Diabetes">
                Type 2 Diabetes
              </Badge>
              <Badge variant="secondary" className="tts-enabled" data-tts-text="Medical condition: Allergic to Seafood">
                Allergic to Seafood
              </Badge>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400 tts-enabled">Blood Type:</span>
            <Badge variant="secondary" className="tts-enabled" data-tts-text="Blood Type: B+">
              B+
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400 tts-enabled">Current Location:</span>
            <span className="font-medium text-blue-600 dark:text-blue-400 tts-enabled">Bangsar, Kuala Lumpur</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Emergency Contacts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="tts-enabled">Emergency Contacts</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="tts-enabled"
            data-tts-text="Share emergency contacts"
          >
            {copiedContact === "all" ? (
              <Check className={`h-4 w-4 ${getIconSize()}`} />
            ) : (
              <Share2 className={`h-4 w-4 ${getIconSize()}`} />
            )}
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {emergencyContacts.map((contact, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg tts-enabled"
              data-tts-text={`${contact.name}, ${contact.number}`}
            >
              <div className="flex-1">
                <h3 className="font-medium">{contact.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{contact.number}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyContact(contact.name, contact.number)}
                  data-tts-text="Copy contact"
                >
                  {copiedContact === contact.number ? (
                    <Check className={`h-4 w-4 text-green-600 ${getIconSize()}`} />
                  ) : (
                    <Copy className={`h-4 w-4 ${getIconSize()}`} />
                  )}
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleCall(contact.number)}
                  className="bg-green-600 hover:bg-green-700 tts-enabled"
                  data-tts-text={`Call ${contact.name}`}
                >
                  <Phone className={`h-4 w-4 mr-1 ${getIconSize()}`} />
                  Call
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* TTS Test Button */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200 tts-enabled">Test Text-to-Speech</p>
              <p className="text-xs text-blue-600 dark:text-blue-300 mt-1 tts-enabled">
                Click to test if speech synthesis is working properly
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                try {
                  const utterance = new SpeechSynthesisUtterance("Ujian suara sedang berfungsi dengan baik")
                  utterance.rate = 0.9
                  utterance.volume = 1.0
                  window.speechSynthesis.speak(utterance)
                } catch (error: unknown) {
                  alert("Speech synthesis error: " + (error instanceof Error ? error.message : "Unknown error"))
                }
              }}
              className="tts-enabled"
              data-tts-text="Test speech button"
            >
              <Volume2 className={`h-4 w-4 mr-1 ${getIconSize()}`} />
              Test
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Safety Tips */}
      <Alert className="dark:bg-gray-900 dark:border-gray-700">
        <AlertTriangle className={`h-4 w-4 ${getIconSize()}`} />
        <AlertDescription className="tts-enabled">
          <strong>Safety Tip:</strong> Only use Emergency SOS in real emergencies. In Malaysia, making false emergency calls 
          can result in legal action under the Communications and Multimedia Act 1998. False alarms divert resources from actual emergencies.
        </AlertDescription>
      </Alert>
    </div>
  )
}
