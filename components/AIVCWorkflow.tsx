"use client"

import React, { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Coins, BotIcon as Robot, VolumeX, Laugh, Rocket } from "lucide-react"
import { toast } from "react-hot-toast"
import { Textarea } from "@/components/ui/textarea"

export default function AIVCWorkflow() {
  const [currentStep, setCurrentStep] = useState(0)
  const [pitch, setPitch] = useState("")
  const [roast, setRoast] = useState("")
  const [memeUrl, setMemeUrl] = useState("")
  const [audioUrl, setAudioUrl] = useState("")
  const [error, setError] = useState("")
  const audioRef = useRef<HTMLAudioElement>(null)

  const steps = [
    {
      title: "Pitch Submission",
      description: "Submit your cringey pitch",
      icon: <VolumeX className="h-6 w-6" />,
      action: "Submit Your Pitch",
    },
    {
      title: "AI Roasting",
      description: "Our AI VC mercilessly roasts the pitch",
      icon: <Robot className="h-6 w-6" />,
      action: "Generate Roast",
    },
    {
      title: "Meme Generation",
      description: "Your failure is immortalized as a meme",
      icon: <Laugh className="h-6 w-6" />,
      action: "Create Meme",
    },
    {
      title: "Shitcoin Staking",
      description: "Stake our $ROAST token via SAFE",
      icon: <Coins className="h-6 w-6" />,
      action: "Stake Now",
    },
  ]

  const handleStepAction = async () => {
    setError("")
    switch (currentStep) {
      case 0:
        if (pitch.trim() === "") {
          toast.error("Please enter your pitch")
          return
        }
        setCurrentStep(1)
        break
      case 1:
        try {
          const response = await fetch("/api/roast", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pitch }),
          })
          const data = await response.json()
          if (!response.ok) {
            throw new Error(data.error || "Failed to generate roast")
          }
          setRoast(data.roast)
          setAudioUrl(data.audioUrl)
          toast.success("Roast generated successfully!")
          setCurrentStep(2)
        } catch (error) {
          console.error("Error generating roast:", error)
          setError(error.message)
          toast.error("Failed to generate roast")
        }
        break
      case 2:
        try {
          const response = await fetch("/api/generate-meme", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ roast }),
          })
          const data = await response.json()
          if (!response.ok) {
            throw new Error(data.error || "Failed to generate meme")
          }
          setMemeUrl(data.memeUrl)
          toast.success("Meme generated successfully!")
          await postToTwitter()
          setCurrentStep(3)
        } catch (error) {
          console.error("Error generating meme:", error)
          setError(error.message)
          toast.error("Failed to generate meme")
        }
        break
      case 3:
        // Implement staking logic here
        toast.success("$ROAST tokens staked successfully!")
        break
    }
  }

  const postToTwitter = async () => {
    try {
      const response = await fetch("/api/post-twitter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pitch, roast, memeUrl }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to post to Twitter")
      }
      toast.success("Posted to Twitter!")
    } catch (error) {
      console.error("Error posting to Twitter:", error)
      setError(error.message)
      toast.error("Failed to post to Twitter")
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">ZRC's Roast-to-Coast Pipeline</h1>
      <p className="text-xl text-center mb-12">Where your dreams go to die, and our shitcoin goes to the moon 🚀</p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <Card key={index} className={`flex flex-col ${index === currentStep ? "ring-2 ring-primary" : ""}`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {step.title}
                {step.icon}
              </CardTitle>
              <CardDescription>{step.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <Badge variant="secondary" className="mb-2">
                Step {index + 1}
              </Badge>
              {index === 0 && (
                <Textarea
                  placeholder="Enter your pitch here..."
                  value={pitch}
                  onChange={(e) => setPitch(e.target.value)}
                  className="w-full mt-2"
                />
              )}
              {index === 1 && roast && (
                <>
                  <p className="text-sm mt-2">Roast: {roast}</p>
                  {audioUrl && (
                    <audio ref={audioRef} src={audioUrl} controls className="w-full mt-2">
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </>
              )}
              {index === 2 && memeUrl && (
                <img src={memeUrl || "/placeholder.svg"} alt="Generated Meme" className="w-full mt-2" />
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleStepAction} disabled={index !== currentStep}>
                {step.action}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card className="mt-12">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Rocket className="mr-2 h-6 w-6" />
            Become a $ROAST Whale
          </CardTitle>
          <CardDescription>Stake your future (and dignity) in our revolutionary shitcoin</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            $ROAST: The only token that gains value with each failed pitch. Stake via SAFE and watch your portfolio burn
            brighter than your dreams!
          </p>
          <Button variant="outline" className="w-full">
            View $ROAST Tokenomics
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

