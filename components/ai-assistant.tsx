"use client"

import { useState, useEffect, useRef } from "react"
import { Bot, Send, Mic, MicOff, Volume2, AlertTriangle, Wifi, WifiOff, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAccessibility } from "@/hooks/use-accessibility"
import ReactMarkdown from "react-markdown"

interface AIAssistantProps {
  onClose?: () => void
}

export function AIAssistant({ onClose }: AIAssistantProps) {
  const { settings } = useAccessibility()
  const [message, setMessage] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [speechSupported, setSpeechSupported] = useState(false)
  const recognitionRef = useRef<any>(null)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "assistant",
      content:
        "Hello! I'm your HUB AI Assistant powered by C3. I'm here to help you with emergency guidance, safety tips, and disaster response instructions. How can I assist you today?",
      timestamp: new Date(),
      isAI: true,
    },
  ])

  const quickActions = [
    "What should I do during an earthquake?",
    "How to find clean water in an emergency?",
    "First aid for severe bleeding",
    "How to signal for help when lost?",
  ]

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognition) {
        setSpeechSupported(true)
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setMessage(transcript)
          setIsListening(false)
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      } else {
        setSpeechSupported(false)
      }
    }
  }, [])

  const handleSendMessage = async () => {
    if (!message.trim()) return

    const newMessage = {
      id: messages.length + 1,
      type: "user",
      content: message,
      timestamp: new Date(),
      isAI: false,
    }

    setMessages([...messages, newMessage])
    const currentMessage = message
    setMessage("")
    setIsLoading(true)

    try {
      // Call OpenAI API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentMessage,
          context: "emergency_assistance",
          conversationHistory: messages.slice(-5), // Send last 5 messages for context
        }),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const aiResponse = {
        id: messages.length + 2,
        type: "assistant",
        content: data.response || "I'm sorry, I couldn't process your request at the moment. Please try again.",
        timestamp: new Date(),
        isAI: true,
      }

      setMessages((prev) => [...prev, aiResponse])
      setIsOnline(true)
    } catch (error) {
      console.error("Error calling AI:", error)
      setIsOnline(false)

      // Fallback to local responses
      const aiResponse = {
        id: messages.length + 2,
        type: "assistant",
        content: getLocalAIResponse(currentMessage),
        timestamp: new Date(),
        isAI: false,
      }
      setMessages((prev) => [...prev, aiResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const getLocalAIResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("earthquake")) {
      return `# 🚨 EARTHQUAKE SAFETY

## Immediate Actions:
1. **DROP** to hands and knees immediately
2. Take **COVER** under sturdy furniture
3. **HOLD ON** and protect head/neck

## If Outdoors:
- Move away from buildings, trees, power lines
- Stay in open areas

## After Shaking Stops:
- Check for injuries and hazards
- Evacuate if building is damaged
- Stay alert for aftershocks`
    } else if (lowerMessage.includes("water") || lowerMessage.includes("purify")) {
      return `# 💧 EMERGENCY WATER PURIFICATION

## Most Effective Methods:
1. **Boil water** for 3+ minutes
2. Use water purification tablets
3. Add 8 drops bleach per gallon (unscented)
4. UV sterilization if available

## Safe Water Sources:
- Rainwater
- Dew collection
- Clear running streams

## ⚠️ AVOID:
- Stagnant water
- Flood water
- Water near waste areas`
    } else if (lowerMessage.includes("first aid") || lowerMessage.includes("bleeding")) {
      return `# 🩹 SEVERE BLEEDING CONTROL

## Emergency Steps:
1. **Call 911 immediately**
2. Apply direct pressure with clean cloth
3. Don't remove embedded objects
4. Elevate wound above heart if possible
5. Apply pressure to pressure points if bleeding continues
6. Use tourniquet only if trained

## Monitor for Shock:
- Pale skin
- Rapid pulse
- Confusion
- Nausea`
    } else if (lowerMessage.includes("signal") || lowerMessage.includes("help") || lowerMessage.includes("lost")) {
      return `# 📡 SIGNALING FOR HELP

## Audio Signals:
- Use whistle (3 sharp blasts)
- Bang metal objects together
- Shout in intervals

## Visual Signals:
- Bright clothing displays
- Mirror reflections
- Ground signals: large X or SOS with rocks/logs
- Fire/smoke during day

## Important:
- Stay in one location if possible
- Conserve phone battery for emergency calls
- Signal at regular intervals`
    } else {
      return `# 🤖 Offline Emergency Assistant

I'm currently in offline mode. I can help with:

- **Earthquake safety**
- **Water purification**
- **First aid procedures**
- **Signaling for help**
- **Emergency shelter**
- **Food safety**
- **Shock treatment**

Please specify your emergency situation for detailed guidance.

## ⚠️ For immediate life-threatening emergencies, call 911.`
    }
  }

  const handleQuickAction = (action: string) => {
    setMessage(action)
  }

  const toggleListening = () => {
    if (!speechSupported) {
      alert("Speech recognition is not supported in your browser. Please try Chrome, Edge, or Safari.")
      return
    }

    if (!recognitionRef.current) {
      alert("Speech recognition is not available.")
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      try {
        recognitionRef.current.start()
        setIsListening(true)
      } catch (error) {
        console.error("Error starting speech recognition:", error)
        setIsListening(false)
      }
    }
  }

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      // Clean markdown from text for speech
      const cleanText = text
        .replace(/#{1,6}\s/g, "") // Remove markdown headers
        .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold markdown
        .replace(/\*(.*?)\*/g, "$1") // Remove italic markdown
        .replace(/`(.*?)`/g, "$1") // Remove code markdown
        .replace(/\[(.*?)\]$$.*?$$/g, "$1") // Remove links, keep text
        .replace(/[#*`_~]/g, "") // Remove remaining markdown characters

      const utterance = new SpeechSynthesisUtterance(cleanText)
      utterance.rate = 0.8
      utterance.pitch = 1
      utterance.volume = 1
      window.speechSynthesis.speak(utterance)
    }
  }

  const getTextSize = () => {
    switch (settings.textSize) {
      case "small":
        return "text-xs"
      case "large":
        return "text-lg"
      case "extra-large":
        return "text-xl"
      default:
        return "text-sm"
    }
  }

  const getIconSize = () => {
    switch (settings.iconSize) {
      case "small":
        return "h-3 w-3"
      case "large":
        return "h-6 w-6"
      default:
        return "h-4 w-4"
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <Bot className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <h1
              className={`font-bold ${settings.textSize === "large" ? "text-2xl" : settings.textSize === "extra-large" ? "text-3xl" : "text-xl"}`}
            >
              AI Assistant
            </h1>
            <div className="flex items-center space-x-2">
              {isOnline ? (
                <>
                  <Wifi className={`text-green-500 ${getIconSize()}`} />
                  <span className={`text-gray-600 dark:text-gray-400 ${getTextSize()}`}>Powered by C3</span>
                </>
              ) : (
                <>
                  <WifiOff className={`text-orange-500 ${getIconSize()}`} />
                  <span className={`text-gray-600 dark:text-gray-400 ${getTextSize()}`}>Offline Mode</span>
                </>
              )}
            </div>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Connection Status Alert */}
      {!isOnline && (
        <Alert className="mb-4 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
          <AlertTriangle className={`text-orange-600 ${getIconSize()}`} />
          <AlertDescription className={`text-orange-800 dark:text-orange-200 ${getTextSize()}`}>
            AI service unavailable. Using offline emergency guidance. For life-threatening emergencies, call 911
            immediately.
          </AlertDescription>
        </Alert>
      )}

      {/* Speech Recognition Status */}
      {!speechSupported && (
        <Alert className="mb-4 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
          <Mic className={`text-blue-600 ${getIconSize()}`} />
          <AlertDescription className={`text-blue-800 dark:text-blue-200 ${getTextSize()}`}>
            Speech recognition is not supported in your browser. Voice input is available in Chrome, Edge, and Safari.
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Actions */}
      {!settings.simpleView && (
        <Card className="mb-4 dark:bg-gray-900">
          <CardHeader>
            <CardTitle className={getTextSize()}>Emergency Help Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className={`${getTextSize()} h-auto py-2 px-3 text-left justify-start dark:border-gray-600 dark:hover:bg-gray-800 whitespace-normal leading-tight`}
                  onClick={() => handleQuickAction(action)}
                  disabled={isLoading}
                >
                  {action}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.type === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              }`}
            >
              {msg.type === "assistant" && (
                <div className="flex items-center space-x-2 mb-2">
                  <Bot className={getIconSize()} />
                  <span className={`font-medium ${getTextSize()}`}>
                    HUB Assistant {msg.isAI ? "(C3)" : "(Offline)"}
                  </span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => speakText(msg.content)}>
                    <Volume2 className="h-3 w-3" />
                  </Button>
                </div>
              )}

              {msg.type === "assistant" ? (
                <div className={`prose prose-sm dark:prose-invert max-w-none ${getTextSize()}`}>
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => (
                        <h1
                          className={`font-bold mb-2 ${settings.textSize === "large" ? "text-lg" : settings.textSize === "extra-large" ? "text-xl" : "text-base"}`}
                        >
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2
                          className={`font-semibold mb-2 ${settings.textSize === "large" ? "text-base" : settings.textSize === "extra-large" ? "text-lg" : "text-sm"}`}
                        >
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => <h3 className={`font-medium mb-1 ${getTextSize()}`}>{children}</h3>,
                      p: ({ children }) => <p className={`mb-2 ${getTextSize()}`}>{children}</p>,
                      ul: ({ children }) => (
                        <ul className={`list-disc list-inside mb-2 ${getTextSize()}`}>{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className={`list-decimal list-inside mb-2 ${getTextSize()}`}>{children}</ol>
                      ),
                      li: ({ children }) => <li className={`mb-1 ${getTextSize()}`}>{children}</li>,
                      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                      em: ({ children }) => <em className="italic">{children}</em>,
                      code: ({ children }) => (
                        <code className={`bg-gray-200 dark:bg-gray-700 px-1 rounded ${getTextSize()}`}>{children}</code>
                      ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className={`whitespace-pre-wrap ${getTextSize()}`}>{msg.content}</p>
              )}

              <p
                className={`opacity-70 mt-1 ${settings.textSize === "large" ? "text-sm" : settings.textSize === "extra-large" ? "text-base" : "text-xs"}`}
              >
                {msg.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Bot className={getIconSize()} />
                <span className={getTextSize()}>C3 AI is thinking</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex items-center space-x-2">
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask for emergency guidance..."
            onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
            className={`pr-12 ${getTextSize()}`}
            disabled={isLoading}
          />
          <Button
            variant="ghost"
            size="icon"
            className={`absolute right-1 top-1 h-8 w-8 ${isListening ? "text-red-600" : speechSupported ? "text-gray-400" : "text-gray-300"}`}
            onClick={toggleListening}
            disabled={isLoading || !speechSupported}
            title={speechSupported ? "Click to use voice input" : "Voice input not supported in this browser"}
          >
            {isListening ? <MicOff className={getIconSize()} /> : <Mic className={getIconSize()} />}
          </Button>
        </div>
        <Button onClick={handleSendMessage} disabled={!message.trim() || isLoading}>
          <Send className={getIconSize()} />
        </Button>
      </div>

      {/* Emergency Notice */}
      <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
        <p
          className={`text-red-800 dark:text-red-200 ${settings.textSize === "large" ? "text-sm" : settings.textSize === "extra-large" ? "text-base" : "text-xs"}`}
        >
          <strong>Emergency Notice:</strong> This AI assistant provides general guidance only. In life-threatening
          situations, call emergency services immediately (911).
        </p>
      </div>
    </div>
  )
}
