"use client"

import { useRouter } from "next/navigation"
import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FloatingChatbot() {
  const router = useRouter()

  const handleClick = () => {
    router.push("/assistant")
  }

  return (
    <div className="fixed bottom-24 right-4 z-50">
      <Button
        size="lg"
        className="h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 bg-blue-600 hover:bg-blue-700"
        onClick={handleClick}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </div>
  )
}
