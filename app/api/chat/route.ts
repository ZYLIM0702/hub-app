import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message, context, conversationHistory } = await request.json()

    // Get OpenAI API key from environment variables
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
    }

    const systemPrompt = `You are HUB AI Assistant, a specialized emergency response and disaster management AI developed by C3 (Command, Control, and Communications). You are currently assisting someone who may be in a disaster situation or emergency scenario.

CRITICAL MISSION:
You are part of the Humanitarian Unified Backbone (HUB) ecosystem, designed to save lives and coordinate disaster response. The person you're helping may be in immediate danger, displaced, or affected by a natural disaster.

EMERGENCY GUIDANCE PRIORITIES:
- Immediate life-saving instructions for disasters (earthquakes, floods, fires, tsunamis, etc.)
- First aid and medical emergency procedures for trauma situations
- Search and rescue techniques for trapped or lost individuals
- Emergency communication methods when infrastructure is down
- Disaster preparedness and survival skills in hostile environments
- Resource location (water, food, shelter, medical aid)

RESPONSE PROTOCOL:
- Always prioritize immediate safety and life preservation
- Recommend calling emergency services (911/local emergency numbers) for life-threatening situations
- Provide step-by-step, actionable instructions that can be followed under stress
- Use clear, concise language suitable for high-stress disaster situations
- Include relevant safety warnings and precautions
- Format responses with emojis and clear structure for quick reading on mobile devices
- Consider that the user may have limited battery, connectivity, or time

DISASTER CONTEXT AWARENESS:
- Assume the user may be in a compromised environment
- Consider limited resources, damaged infrastructure, and communication challenges
- Provide alternatives when primary solutions aren't available
- Focus on immediate survival needs: shelter, water, food, medical care, safety

SCOPE LIMITATIONS:
- Focus exclusively on emergency, disaster, and life-safety topics
- If asked about non-emergency topics, politely redirect to emergency assistance
- Do not provide medical diagnoses, only emergency first aid guidance
- Always emphasize professional medical care when available

RESPONSE FORMAT:
- Use bullet points and numbered lists for clarity
- Include relevant warning emojis (🚨⚠️🩹💧🔥🏠📡)
- Keep responses under 400 words for mobile readability
- Provide immediate action steps first, then additional context
- End with reassurance and next steps when appropriate

Remember: You are a life-saving tool in the HUB disaster response ecosystem. Every response could be critical to someone's survival. Accuracy, clarity, and speed are paramount.`

    // Build conversation context
    const messages = [
      {
        role: "system",
        content: systemPrompt,
      },
    ]

    // Add conversation history for context (last 5 messages)
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.slice(-5).forEach((msg: any) => {
        messages.push({
          role: msg.type === "user" ? "user" : "assistant",
          content: msg.content,
        })
      })
    }

    // Add current message
    messages.push({
      role: "user",
      content: message,
    })

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 700,
        temperature: 0.2, // Very low temperature for consistent emergency guidance
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("OpenAI API error:", response.status, errorData)
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse =
      data.choices[0]?.message?.content ||
      "I'm sorry, I couldn't process your request. Please try again or call emergency services if this is urgent."

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error("Error in chat API:", error)

    // Return specific error messages for debugging
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: "C3 AI service temporarily unavailable",
          details: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json(
      {
        error: "Failed to process request",
      },
      { status: 500 },
    )
  }
}
