import { useState, useRef, useEffect } from 'react'
import { Volume2, Loader2, ChevronRight, ChevronLeft } from 'lucide-react'
import './ConversationLesson.css'

interface ConversationLessonProps {
  lessonId: number
  onBack: () => void
}

interface ConversationLine {
  speaker: string
  bengali: string
  transliteration: string
  english: string
}

interface VocabItem {
  bengali: string
  transliteration: string
  english: string
}

interface MiniConversation {
  id: number
  image: string
  conversation: ConversationLine[]
  vocabulary: VocabItem[]
  notes?: {
      title: string;
      content: string[];
  }
}

interface LessonData {
  title: string
  scenarios: MiniConversation[]
}

const lessonsData: Record<number, LessonData> = {
  1: {
    title: 'Absolute Basics',
    scenarios: [
      {
        id: 1,
        image: '/how_are_you.png',
        conversation: [
          {
            speaker: 'Panda',
            bengali: 'কেমন আছো?',
            transliteration: 'Kemon achho?',
            english: 'How are you?'
          },
          {
            speaker: 'Alpaca',
            bengali: 'আমি ভালো আছি।',
            transliteration: 'Ami bhalo achhi.',
            english: 'I am well.'
          }
        ],
        vocabulary: [
          { bengali: 'কেমন', transliteration: 'kemon', english: 'how' },
          { bengali: 'আছো', transliteration: 'achho', english: 'are (you, informal)' },
          { bengali: 'আমি', transliteration: 'ami', english: 'I' },
          { bengali: 'ভালো', transliteration: 'bhalo', english: 'good / well' },
          { bengali: 'আছি', transliteration: 'achhi', english: 'am' },
        ]
      },
      {
        id: 2,
        image: '/what_is_your_name.png',
        conversation: [
          {
            speaker: 'A',
            bengali: 'তোমার নাম কী?',
            transliteration: 'Tomar naam ki?',
            english: 'What is your name?'
          },
          {
            speaker: 'B',
            bengali: 'আমার নাম টিমি।',
            transliteration: 'Amar naam Timmy.',
            english: 'My name is Timmy.'
          }
        ],
        vocabulary: [
          { bengali: 'তোমার', transliteration: 'tomar', english: 'your (informal)' },
          { bengali: 'নাম', transliteration: 'naam', english: 'name' },
          { bengali: 'কী', transliteration: 'ki', english: 'what' },
          { bengali: 'আমার', transliteration: 'amar', english: 'my' }
        ],
        notes: {
          title: 'Grammar Notes',
          content: [
            'Sentence structure: Bengali questions often end with কী (ki)',
            'Word order is flexible but commonly: [your] + [name] + [what]',
            'Formality: তোমার (tomar) is the informal "your"',
            'Appropriate for: friends, family, animals, casual conversation',
            'A polite version can be introduced later: আপনার নাম কী? (Apnar naam ki?)'
          ]
        }
      },
      {
        id: 3,
        image: '/meet_my_friend.png',
        conversation: [
          {
            speaker: 'A',
            bengali: 'এই আমার বন্ধু।',
            transliteration: 'Ei amar bondhu.',
            english: 'This is my friend.'
          },
          {
            speaker: 'B',
            bengali: 'তোমার বন্ধুকে পেয়ে ভালো লাগলো।',
            transliteration: 'Tomar bondhu ke peye bhalo laglo.',
            english: 'Nice to meet your friend.'
          }
        ],
        vocabulary: [
          { bengali: 'এই', transliteration: 'ei', english: 'this' },
          { bengali: 'আমার', transliteration: 'amar', english: 'my' },
          { bengali: 'বন্ধু', transliteration: 'bondhu', english: 'friend' },
          { bengali: 'ভালো', transliteration: 'bhalo', english: 'good / nice' },
          { bengali: 'লাগলো', transliteration: 'laglo', english: 'felt (as in "felt good")' }
        ],
        notes: {
          title: 'Grammar Notes',
          content: [
            'Demonstrative pronoun: এই (ei) means "this" and is used for something close by',
            'Possessive structure: আমার বন্ধু literally means "my friend"',
            'Pattern: [possessive] + [noun]',
            'Natural spoken Bengali: "এই আমার বন্ধু।" is a very common, natural way to introduce someone'
          ]
        }
      }
    ]
  }
}

export default function ConversationLesson({ lessonId, onBack }: ConversationLessonProps) {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0)
  const [isScriptFlipped, setIsScriptFlipped] = useState(false)
  const [currentVocabIndex, setCurrentVocabIndex] = useState(0)
  const [isVocabFlipped, setIsVocabFlipped] = useState(false)
  const [isLoadingAudio, setIsLoadingAudio] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const lesson = lessonsData[lessonId]

  if (!lesson) {
    return (
      <div className="conversation-lesson">
        <header className="header">
           <h1 className="title">Lesson {lessonId}</h1>
           <button className="home-button" onClick={onBack}>Home</button>
        </header>
        <div className="card">
          <p>Lesson content not found.</p>
        </div>
      </div>
    )
  }

  const currentScenario = lesson.scenarios[currentScenarioIndex]

  // Reset state when scenario changes
  useEffect(() => {
    setIsScriptFlipped(false)
    setCurrentVocabIndex(0)
    setIsVocabFlipped(false)
    window.scrollTo(0, 0)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
  }, [currentScenarioIndex])

  const handlePlayConversation = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    setIsLoadingAudio(true)

    // Construct SSML with different voices
    // Speaker 1 (Panda/A): bn-IN-Wavenet-B (Male)
    // Speaker 2 (Alpaca/B): bn-IN-Wavenet-A (Female)
    const ssml = `
      <speak>
        <voice name="bn-IN-Wavenet-B">
          ${currentScenario.conversation[0].bengali}
        </voice>
        <break time="400ms"/>
        <voice name="bn-IN-Wavenet-A">
          ${currentScenario.conversation[1].bengali}
        </voice>
        <break time="800ms"/>
      </speak>
    `

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ssml,
          speakingRate: 0.85,
          pitch: 0
        }),
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error || 'Failed to generate speech')
      }

      const data = await response.json()
      const audio = new Audio(data.audioDataUri)
      audioRef.current = audio
      
      audio.onended = () => setIsLoadingAudio(false)
      audio.onerror = () => setIsLoadingAudio(false)
      
      await audio.play()
    } catch (error) {
      console.error('Error playing audio:', error)
      setIsLoadingAudio(false)
      alert('Failed to play audio: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const handlePlayVocab = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const item = currentScenario.vocabulary[currentVocabIndex]
    
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    setIsLoadingAudio(true)

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: item.bengali,
          speakingRate: 0.85,
          pitch: 0
        }),
      })

      if (!response.ok) throw new Error('Failed to generate speech')

      const data = await response.json()
      const audio = new Audio(data.audioDataUri)
      audioRef.current = audio
      
      audio.onended = () => setIsLoadingAudio(false)
      audio.onerror = () => setIsLoadingAudio(false)
      
      await audio.play()
    } catch (error) {
      console.error('Error playing audio:', error)
      setIsLoadingAudio(false)
    }
  }

  const handleNextVocab = () => {
    if (currentVocabIndex < currentScenario.vocabulary.length - 1) {
      setCurrentVocabIndex(prev => prev + 1)
      setIsVocabFlipped(false)
    } else {
      // End of vocabulary for this scenario
      if (currentScenarioIndex < lesson.scenarios.length - 1) {
        // Move to next scenario
        // IMPORTANT: Reset vocab index HERE to prevent out-of-bounds access on next render
        setCurrentScenarioIndex(prev => prev + 1)
        setCurrentVocabIndex(0)
        setIsVocabFlipped(false)
        setIsScriptFlipped(false)
      } else {
        // End of all scenarios
        onBack() 
      }
    }
  }

  const handlePrevVocab = () => {
    if (currentVocabIndex > 0) {
      setCurrentVocabIndex(prev => prev - 1)
      setIsVocabFlipped(false)
    }
  }

  const handleVocabFlip = () => {
    setIsVocabFlipped(!isVocabFlipped)
  }

  const currentVocab = currentScenario.vocabulary[currentVocabIndex]
  const isLastScenario = currentScenarioIndex === lesson.scenarios.length - 1
  const isLastVocab = currentVocabIndex === currentScenario.vocabulary.length - 1

  return (
    <div className="conversation-lesson">
      <header className="header">
        <h1 className="title">{lesson.title}</h1>
        <button className="home-button" onClick={onBack}>Home</button>
      </header>

      <div className="lesson-content">
        {/* Conversation Image */}
        <div className="image-container">
          <img src={currentScenario.image} alt="Conversation Context" className="lesson-image" />
        </div>

        {/* Conversation Script Card */}
        <div className="script-section">
          <div 
            className={`script-card ${isScriptFlipped ? 'flipped' : ''}`} 
            onClick={() => setIsScriptFlipped(!isScriptFlipped)}
          >
            <div className="script-content">
              {!isScriptFlipped ? (
                // Front: Bengali + Transliteration
                <div className="script-front">
                  {currentScenario.conversation.map((line, idx) => (
                    <div key={idx} className="script-line">
                      <span className="speaker-label">{line.speaker}:</span>
                      <div className="text-group">
                        <div className="bengali-text">{line.bengali}</div>
                        <div className="transliteration-text">{line.transliteration}</div>
                      </div>
                    </div>
                  ))}
                  <div className="tap-hint">Tap to see translation</div>
                </div>
              ) : (
                // Back: English Translation
                <div className="script-back">
                  {currentScenario.conversation.map((line, idx) => (
                    <div key={idx} className="script-line">
                      <span className="speaker-label">{line.speaker}:</span>
                      <div className="text-group">
                        <div className="english-text">{line.english}</div>
                      </div>
                    </div>
                  ))}
                  <div className="tap-hint">Tap to see original</div>
                </div>
              )}
            </div>
          </div>
          
          <button 
            className="play-conversation-button" 
            onClick={handlePlayConversation}
            disabled={isLoadingAudio}
          >
            {isLoadingAudio ? <Loader2 className="spinner" /> : <Volume2 />}
            <span>Play Conversation</span>
          </button>
        </div>

        {/* Vocabulary Section */}
        <div className="vocab-section">
          <h2 className="section-title">Vocabulary Breakdown</h2>
          
          <div className="flashcards-section">
            <div className="progress-indicator">
              {currentVocabIndex + 1} / {currentScenario.vocabulary.length}
            </div>

            <div className="flashcard-container">
              <div className="flashcard-content">
                {!isVocabFlipped ? (
                  <div className="flashcard-front">
                    <div className="flashcard-bengali">{currentVocab.bengali}</div>
                    <div className="flashcard-transliteration">{currentVocab.transliteration}</div>
                    <button 
                      className="flashcard-speaker-button" 
                      onClick={handlePlayVocab}
                      disabled={isLoadingAudio}
                    >
                      {isLoadingAudio ? (
                        <Loader2 size={20} className="spinner" />
                      ) : (
                        <Volume2 size={20} />
                      )}
                    </button>
                    <button 
                      className="flashcard-arrow-button flashcard-arrow-right"
                      onClick={handleVocabFlip}
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>
                ) : (
                  <div className="flashcard-back">
                    <div className="flashcard-english">{currentVocab.english}</div>
                    <button 
                      className="flashcard-speaker-button" 
                      onClick={handlePlayVocab}
                      disabled={isLoadingAudio}
                    >
                      {isLoadingAudio ? (
                        <Loader2 size={20} className="spinner" />
                      ) : (
                        <Volume2 size={20} />
                      )}
                    </button>
                    <button 
                      className="flashcard-arrow-button flashcard-arrow-left"
                      onClick={handleVocabFlip}
                    >
                      <ChevronLeft size={24} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="cl-navigation-buttons">
              <button 
                className="next-button" 
                onClick={handleNextVocab}
              >
                {isLastVocab ? (isLastScenario ? 'Finish Lesson' : 'Next Conversation') : 'Next'}
              </button>
              <button 
                className="cl-back-button" 
                onClick={handlePrevVocab}
                disabled={currentVocabIndex === 0}
                style={{ visibility: currentVocabIndex === 0 ? 'hidden' : 'visible' }}
              >
                Back
              </button>
            </div>
          </div>
        </div>

        {/* Grammar Notes Section */}
        {currentScenario.notes && (
          <div className="notes-section">
            <h2 className="section-title">{currentScenario.notes.title}</h2>
            <div className="notes-card">
              <ul className="notes-list">
                {currentScenario.notes.content.map((note, idx) => (
                  <li key={idx} className="note-item">{note}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}