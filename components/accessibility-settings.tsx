"use client"

import { Settings, Type, Eye, Volume2, Zap, Smartphone } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useAccessibilityContext } from "@/hooks/use-accessibility-provider"
import { useTextToSpeech } from "@/hooks/use-text-to-speech"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function AccessibilitySettings() {
  const { settings, updateSettings, speakText } = useAccessibilityContext()
  const { testSpeech, speechSupported, voicesCount } = useTextToSpeech()
  const router = useRouter()

  const textSizeOptions = [
    { value: "small", label: "Small", demo: "Aa" },
    { value: "normal", label: "Normal", demo: "Aa" },
    { value: "large", label: "Large", demo: "Aa" },
    { value: "extra-large", label: "Extra Large", demo: "Aa" },
  ]

  const iconSizeOptions = [
    { value: "small", label: "Small" },
    { value: "normal", label: "Normal" },
    { value: "large", label: "Large" },
  ]

  const handleTextSizeChange = (size: string) => {
    updateSettings({ textSize: size as any })
    speakText(`Text size changed to ${size}`)
  }

  const handleIconSizeChange = (size: string) => {
    updateSettings({ iconSize: size as any })
    speakText(`Icon size changed to ${size}`)
  }

  const handleToggle = (setting: string, value: boolean, description: string) => {
    updateSettings({ [setting]: value })
    speakText(`${description} ${value ? "enabled" : "disabled"}`)
    
    // Force reload the page when toggling TTS
    if (setting === "textToSpeech") {
      window.location.reload()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2 tts-enabled">Accessibility Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 tts-enabled">
          Customize the app to meet your accessibility needs
        </p>
      </div>

      {/* Text Size */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 tts-enabled">
            <Type className="h-5 w-5" />
            <span>Text Size</span>
          </CardTitle>
          <CardDescription className="tts-enabled">Adjust text size for better readability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {textSizeOptions.map((option) => (
              <Button
                key={option.value}
                variant={settings.textSize === option.value ? "default" : "outline"}
                className="h-16 flex flex-col items-center justify-center space-y-1 tts-enabled"
                onClick={() => handleTextSizeChange(option.value)}
                data-tts-text={`${option.label} text size`}
              >
                <span
                  className={`font-bold ${
                    option.value === "small"
                      ? "text-xs"
                      : option.value === "large"
                        ? "text-lg"
                        : option.value === "extra-large"
                          ? "text-xl"
                          : "text-sm"
                  }`}
                >
                  {option.demo}
                </span>
                <span className="text-xs">{option.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Icon Size */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 tts-enabled">
            <Smartphone className="h-5 w-5" />
            <span>Icon Size</span>
          </CardTitle>
          <CardDescription className="tts-enabled">Adjust icon size for better visibility</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Update the icon size buttons to show a more visible difference */}
          <div className="grid grid-cols-3 gap-3">
            {iconSizeOptions.map((option) => (
              <Button
                key={option.value}
                variant={settings.iconSize === option.value ? "default" : "outline"}
                className="h-16 flex flex-col items-center justify-center space-y-2 tts-enabled"
                onClick={() => handleIconSizeChange(option.value)}
                data-tts-text={`${option.label} icon size`}
              >
                <Settings
                  className={option.value === "small" ? "scale-75" : option.value === "large" ? "scale-150" : ""}
                />
                <span className="text-xs">{option.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Display Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 tts-enabled">
            <Eye className="h-5 w-5" />
            <span>Display Options</span>
          </CardTitle>
          <CardDescription className="tts-enabled">Customize visual appearance and behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium tts-enabled">Simple View</Label>
              <p className="text-xs text-gray-600 dark:text-gray-400 tts-enabled">
                Hide non-essential elements for cleaner interface
              </p>
            </div>
            <Switch
              checked={settings.simpleView}
              onCheckedChange={(checked) => handleToggle("simpleView", checked, "Simple view")}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium tts-enabled">High Contrast</Label>
              <p className="text-xs text-gray-600 dark:text-gray-400 tts-enabled">
                Increase contrast for better visibility
              </p>
            </div>
            <Switch
              checked={settings.highContrast}
              onCheckedChange={(checked) => handleToggle("highContrast", checked, "High contrast")}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium tts-enabled">Reduce Motion</Label>
              <p className="text-xs text-gray-600 dark:text-gray-400 tts-enabled">
                Minimize animations and transitions
              </p>
            </div>
            <Switch
              checked={settings.reduceMotion}
              onCheckedChange={(checked) => handleToggle("reduceMotion", checked, "Reduce motion")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Audio Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 tts-enabled">
            <Volume2 className="h-5 w-5" />
            <span>Audio Options</span>
          </CardTitle>
          <CardDescription className="tts-enabled">Configure text-to-speech and audio feedback</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium tts-enabled">Text-to-Speech</Label>
              <p className="text-xs text-gray-600 dark:text-gray-400 tts-enabled">
                Enable voice reading of text content
              </p>
              {speechSupported && (
                <p className="text-xs text-green-600 dark:text-green-400 tts-enabled">
                  ✓ Supported ({voicesCount} voices available)
                </p>
              )}
              {!speechSupported && (
                <p className="text-xs text-red-600 dark:text-red-400 tts-enabled">✗ Not supported in this browser</p>
              )}
            </div>
            <Switch
              checked={settings.textToSpeech}
              onCheckedChange={(checked) => handleToggle("textToSpeech", checked, "Text to speech")}
              disabled={!speechSupported}
            />
          </div>

          <div className="pt-2 space-y-2">
            <Button
              variant="outline"
              className="w-full tts-enabled"
              onClick={testSpeech}
              disabled={!speechSupported}
              data-tts-text="Test text to speech functionality"
            >
              <Volume2 className="h-4 w-4 mr-2" />
              Test Text-to-Speech
            </Button>

            {speechSupported && (
              <Button
                variant="outline"
                className="w-full tts-enabled"
                onClick={() => {
                  const utterance = new SpeechSynthesisUtterance(
                    "Press and hold any text for 800 milliseconds to hear it spoken. Use Control plus Space on any focused element for keyboard access. Press Escape to stop speaking.",
                  )
                  utterance.rate = 0.8
                  window.speechSynthesis.speak(utterance)
                }}
                data-tts-text="Play instructions for text to speech"
              >
                <Volume2 className="h-4 w-4 mr-2" />
                Play Instructions
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 tts-enabled">
            <Zap className="h-5 w-5" />
            <span>Quick Actions</span>
          </CardTitle>
          <CardDescription className="tts-enabled">Reset or apply preset configurations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full tts-enabled"
            onClick={() => {
              updateSettings({
                textSize: "large",
                iconSize: "large",
                simpleView: true,
                highContrast: true,
                textToSpeech: true,
              })
              speakText("Applied accessibility preset for better visibility and usability")
            }}
            data-tts-text="Apply accessibility preset"
          >
            Apply Accessibility Preset
          </Button>

          <Button
            variant="outline"
            className="w-full tts-enabled"
            onClick={() => {
              updateSettings({
                textSize: "normal",
                iconSize: "normal",
                simpleView: false,
                highContrast: false,
                reduceMotion: false,
                textToSpeech: true,
              })
              speakText("Reset all accessibility settings to default")
            }}
            data-tts-text="Reset to default settings"
          >
            Reset to Default
          </Button>
        </CardContent>
      </Card>

      {/* Information */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start space-x-2">
            <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200 tts-enabled">Accessibility Features</p>
              <p className="text-xs text-blue-600 dark:text-blue-300 mt-1 tts-enabled">
                These settings are saved locally and will persist across app sessions. The app also respects your system
                accessibility preferences.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
