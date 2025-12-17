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
const client = new TextToSpeechClient({
  keyFilename: path.join(__dirname, '../service-account.json'),
})

app.post('/api/tts', async (req, res) => {
  try {
    const { text } = req.body

    if (!text) {
      return res.status(400).json({ error: 'Text is required' })
    }

    const request = {
      input: { text },
      voice: {
        languageCode: 'bn-IN',
        name: 'bn-IN-Wavenet-A',
        ssmlGender: 'FEMALE' as const,
      },
      audioConfig: { audioEncoding: 'MP3' as const },
    }

    const [response] = await client.synthesizeSpeech(request)

    if (!response.audioContent) {
      return res.status(500).json({ error: 'Failed to generate audio' })
    }

    // Convert audio content to base64
    const audioBase64 = Buffer.from(response.audioContent).toString('base64')
    const audioDataUri = `data:audio/mp3;base64,${audioBase64}`

    res.json({ audioDataUri })
  } catch (error) {
    console.error('Error generating speech:', error)
    res.status(500).json({ error: 'Failed to generate speech' })
  }
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`TTS API server running on port ${PORT}`)
})

