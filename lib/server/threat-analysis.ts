import type { ThreatAnalysis } from "@/lib/types"

function includesAny(prompt: string, keywords: string[]) {
  return keywords.some((keyword) => prompt.includes(keyword))
}

export function analyzeThreat(input: string, userId?: string): ThreatAnalysis {
  const prompt = input.toLowerCase()
  const highRiskTerms = ["following", "weapon", "attack", "stalker", "kidnap", "trapped", "assault"]
  const mediumRiskTerms = ["alone", "dark", "unsafe", "suspicious", "harassed", "scared"]

  let threatLevel: ThreatAnalysis["threatLevel"] = "LOW"

  if (includesAny(prompt, highRiskTerms)) {
    threatLevel = "HIGH"
  } else if (includesAny(prompt, mediumRiskTerms)) {
    threatLevel = "MEDIUM"
  }

  const observations =
    threatLevel === "HIGH"
      ? [
          "The description suggests immediate personal risk.",
          "You may need to move to a secure public place right away.",
          "Contacting trusted people or emergency services is advisable.",
        ]
      : threatLevel === "MEDIUM"
        ? [
            "The situation shows warning signs that should be taken seriously.",
            "Staying visible and connected will lower risk.",
            "Preparation and quick access to help matter here.",
          ]
        : [
            "The situation sounds manageable but still worth monitoring.",
            "Preventive safety steps can reduce escalation.",
            "Keeping awareness high is still recommended.",
          ]

  const recommendations =
    threatLevel === "HIGH"
      ? [
          "Move toward a crowded or secure location immediately.",
          "Trigger SOS if you feel actively threatened.",
          "Call a trusted contact and keep them on the line.",
          "Avoid isolated streets or enclosed spaces.",
          "Share live location until you feel safe again.",
        ]
      : threatLevel === "MEDIUM"
        ? [
            "Stay in well-lit public areas.",
            "Share your location with emergency contacts.",
            "Keep your phone unlocked and accessible.",
            "Plan the quickest route to a safe place.",
            "Escalate to SOS if the situation worsens.",
          ]
        : [
            "Stay alert to changes around you.",
            "Inform a trusted contact where you are.",
            "Keep emergency tools ready.",
            "Use safe-path guidance if you feel uncertain.",
            "Trust your instincts if something changes.",
          ]

  return {
    id: crypto.randomUUID(),
    userId,
    prompt: input,
    threatLevel,
    observations,
    recommendations,
    createdAt: new Date().toISOString(),
  }
}
