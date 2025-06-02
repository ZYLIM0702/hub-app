"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Heart,
  ChevronLeft,
  CreditCard,
  Smartphone,
  Building,
  Shield,
  Check,
  Users,
  Calendar,
  DollarSign,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

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
  isUrgent?: boolean
  isVerified?: boolean
}

type PaymentMethod = {
  id: string
  type: "card" | "mobile" | "bank"
  name: string
  icon: React.ElementType
  details?: string
}

export function DonatePage({ campaignId }: { campaignId: string }) {
  const router = useRouter()
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [donationAmount, setDonationAmount] = useState("")
  const [customAmount, setCustomAmount] = useState("")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isRecurring, setIsRecurring] = useState(false)
  const [step, setStep] = useState(1) // 1: Amount, 2: Payment, 3: Confirmation, 4: Success
  const [isProcessing, setIsProcessing] = useState(false)

  const predefinedAmounts = ["10", "25", "50", "100", "250", "500"]

  const paymentMethods: PaymentMethod[] = [
    {
      id: "card",
      type: "card",
      name: "Credit/Debit Card",
      icon: CreditCard,
      details: "Visa, Mastercard, American Express",
    },
    {
      id: "mobile",
      type: "mobile",
      name: "Mobile Payment",
      icon: Smartphone,
      details: "Apple Pay, Google Pay, Samsung Pay",
    },
    {
      id: "bank",
      type: "bank",
      name: "Bank Transfer",
      icon: Building,
      details: "Direct bank transfer",
    },
  ]

  useEffect(() => {
    // Load campaign data (in real app, this would be from API)
    const campaigns = [
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
      // Add more campaigns as needed
    ]

    const foundCampaign = campaigns.find((c) => c.id === campaignId)
    if (foundCampaign) {
      setCampaign(foundCampaign)
    }
  }, [campaignId])

  const handleAmountSelect = (amount: string) => {
    setDonationAmount(amount)
    setCustomAmount("")
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    setDonationAmount("")
  }

  const getCurrentAmount = () => {
    return customAmount || donationAmount
  }

  const handleNextStep = () => {
    if (step === 1 && getCurrentAmount()) {
      setStep(2)
    } else if (step === 2 && selectedPaymentMethod) {
      setStep(3)
    } else if (step === 3) {
      processDonation()
    }
  }

  const processDonation = async () => {
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsProcessing(false)
    setStep(4)

    // Update campaign data (in real app, this would be API call)
    if (campaign) {
      const amount = Number.parseFloat(getCurrentAmount())
      setCampaign({
        ...campaign,
        raised: campaign.raised + amount,
        donors: campaign.donors + 1,
      })
    }
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Choose Donation Amount</h2>
              <p className="text-gray-600 dark:text-gray-400">Every contribution makes a difference</p>
            </div>

            {/* Predefined Amounts */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Quick Select</Label>
              <div className="grid grid-cols-3 gap-3">
                {predefinedAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant={donationAmount === amount ? "default" : "outline"}
                    className="h-12"
                    onClick={() => handleAmountSelect(amount)}
                  >
                    ${amount}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div>
              <Label htmlFor="custom-amount" className="text-sm font-medium mb-2 block">
                Custom Amount
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="custom-amount"
                  type="number"
                  placeholder="Enter amount"
                  className="pl-10"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                />
              </div>
            </div>

            {/* Donation Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Make this a monthly donation</Label>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Recurring donations help provide sustained support
                  </p>
                </div>
                <Switch checked={isRecurring} onCheckedChange={setIsRecurring} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Donate anonymously</Label>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Your name won't be shown publicly</p>
                </div>
                <Switch checked={isAnonymous} onCheckedChange={setIsAnonymous} />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Payment Method</h2>
              <p className="text-gray-600 dark:text-gray-400">Choose how you'd like to donate</p>
            </div>

            <div className="space-y-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon
                return (
                  <Card
                    key={method.id}
                    className={`cursor-pointer transition-colors ${
                      selectedPaymentMethod === method.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                        : "hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{method.name}</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{method.details}</p>
                        </div>
                        {selectedPaymentMethod === method.id && <Check className="h-5 w-5 text-blue-600" />}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {selectedPaymentMethod === "card" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Card Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input id="card-number" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cardholder">Cardholder Name</Label>
                    <Input id="cardholder" placeholder="John Doe" />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Confirm Donation</h2>
              <p className="text-gray-600 dark:text-gray-400">Please review your donation details</p>
            </div>

            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Donation Amount</span>
                  <span className="font-bold text-lg">${getCurrentAmount()}</span>
                </div>

                {isRecurring && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Frequency</span>
                    <Badge>Monthly</Badge>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Payment Method</span>
                  <span className="font-medium">
                    {paymentMethods.find((m) => m.id === selectedPaymentMethod)?.name}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Anonymous</span>
                  <span className="font-medium">{isAnonymous ? "Yes" : "No"}</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${getCurrentAmount()}</span>
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Secure Transaction</p>
                  <p className="text-xs text-blue-600 dark:text-blue-300">
                    Your payment is protected by 256-bit SSL encryption
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full">
                <Check className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Your donation of ${getCurrentAmount()} has been successfully processed
              </p>
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Transaction ID</span>
                    <span className="font-mono text-sm">TXN-{Date.now().toString().slice(-8)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Date</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Receipt</span>
                    <Button variant="link" className="p-0 h-auto">
                      Email Receipt
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button className="w-full" onClick={() => router.push("/crowdfunding")}>
                Back to Campaigns
              </Button>
              <Button variant="outline" className="w-full">
                Share This Campaign
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (!campaign) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading campaign...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold">Donate</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Step {step} of 4</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <Progress value={(step / 4) * 100} className="h-2" />

      {/* Campaign Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="bg-gray-200 dark:bg-gray-800 p-2 rounded-lg">
              <Heart className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{campaign.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">by {campaign.organizer}</p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-3 w-3" />
                  <span>${campaign.raised.toLocaleString()} raised</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>{campaign.donors} donors</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{campaign.daysLeft} days left</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {renderStepContent()}

      {/* Navigation Buttons */}
      {step < 4 && (
        <div className="flex space-x-3">
          {step > 1 && (
            <Button variant="outline" className="flex-1" onClick={() => setStep(step - 1)} disabled={isProcessing}>
              Back
            </Button>
          )}
          <Button
            className="flex-1"
            onClick={handleNextStep}
            disabled={(step === 1 && !getCurrentAmount()) || (step === 2 && !selectedPaymentMethod) || isProcessing}
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing...</span>
              </div>
            ) : step === 3 ? (
              "Complete Donation"
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
