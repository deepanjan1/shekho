import express from 'express'
import cors from 'cors'
import { TextToSpeechClient } from '@google-cloud/text-to-speech'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(cors())
app.use(express.json())

// Initialize Google Cloud TTS client
// In production (GCP), it will use Application Default Credentials automatically if keyFilename is omitted.
const client = new TextToSpeechClient(
  process.env.NODE_ENV === 'production' 
    ? {} 
    : { keyFilename: path.join(__dirname, '../service-account.json') }
)

// Serve static files from the React build
app.use(express.static(path.join(__dirname, '../dist')))

app.post('/api/tts', async (req, res) => {
  try {
    const { text, ssml, speakingRate = 1.0, pitch = 0.0 } = req.body

    if (!text && !ssml) {
      return res.status(400).json({ error: 'Text or SSML is required' })
    }

    const input = ssml ? { ssml } : { text }

    const request = {
      input,
      voice: {
        languageCode: 'bn-IN',
        name: 'bn-IN-Wavenet-A',
        ssmlGender: 'FEMALE' as const,
      },
      audioConfig: { 
        audioEncoding: 'MP3' as const,
        speakingRate,
        pitch
      },
    }

    const [response] = await client.synthesizeSpeech(request)

    if (!response.audioContent) {
      return res.status(500).json({ error: 'Failed to generate audio' })
    }

    // Convert audio content to base64
    const audioBase64 = Buffer.from(response.audioContent).toString('base64')
    const audioDataUri = `data:audio/mp3;base64,${audioBase64}`

    res.json({ audioDataUri })
  } catch (error: any) {
    console.error('Error generating speech:', error)
    // Log detailed error from Google API if available
    if (error.details) console.error('Google API Error Details:', error.details)
    res.status(500).json({ error: error.message || 'Failed to generate speech' })
  }
})

// Handle client-side routing: return index.html for all other routes
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`TTS API server running on port ${PORT}`)
})

