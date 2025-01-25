import fetch from "node-fetch"

export class ElevenLabs {
  private apiKey: string
  private apiUrl = "https://api.elevenlabs.io/v1"

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async textToSpeech(text: string, voiceId: string, stability: number): Promise<Buffer> {
    const response = await fetch(`${this.apiUrl}/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": this.apiKey,
      },
      body: JSON.stringify({
        text,
        voice_settings: {
          stability,
          similarity_boost: 0.75,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`)
    }

    return Buffer.from(await response.arrayBuffer())
  }
}

