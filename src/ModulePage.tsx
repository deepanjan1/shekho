import { useState, useRef, useEffect } from 'react'
import { Volume2, Loader2, ChevronRight, ChevronLeft } from 'lucide-react'
import './ModulePage.css'

interface ModulePageProps {
  phaseIndex: number
  moduleIndex: number
  phaseTitle: string
  moduleTitle: string
  onHomeClick: () => void
  onModuleComplete?: (phaseIndex: number, moduleIndex: number) => void
}

type ExerciseItem = 
  | { type: 'letter'; bengali: string; transliteration: string }
  | { type: 'word'; bengali: string; transliteration: string; english: string }

const exercises: ExerciseItem[] = [
  { type: 'letter', bengali: 'অ', transliteration: 'ô / o' },
  { type: 'letter', bengali: 'আ', transliteration: 'aa' },
  { type: 'word', bengali: 'মা', transliteration: 'Maa', english: 'Mother' },
  { type: 'word', bengali: 'বাবা', transliteration: 'Baba', english: 'Father' },
  { type: 'word', bengali: 'না', transliteration: 'Na', english: 'No / Not' },
  { type: 'word', bengali: 'নমস্কার', transliteration: 'Nomoshkar', english: 'Greetings' },
  { type: 'letter', bengali: 'ই', transliteration: 'i' },
  { type: 'letter', bengali: 'উ', transliteration: 'u' },
  { type: 'word', bengali: 'এই', transliteration: 'Ei', english: 'This' },
  { type: 'word', bengali: 'ওই', transliteration: 'Oi', english: 'That' },
  { type: 'word', bengali: 'বই', transliteration: 'Boi', english: 'Book' },
  { type: 'word', bengali: 'এই মা', transliteration: 'Ei maa', english: 'This mother' },
  { type: 'word', bengali: 'ওই বাবা', transliteration: 'Oi baba', english: 'That father' },
  { type: 'word', bengali: 'এই বই', transliteration: 'Ei boi', english: 'This book' },
]

const extendedExercises: ExerciseItem[] = [
  { type: 'word', bengali: 'জল', transliteration: 'Jol', english: 'Water' },
  { type: 'word', bengali: 'চা', transliteration: 'Cha', english: 'Tea' },
  { type: 'word', bengali: 'ভালো', transliteration: 'Bhalo', english: 'Good / Well' },
  { type: 'word', bengali: 'আর', transliteration: 'Ar', english: 'And' },
  { type: 'word', bengali: 'এই মা', transliteration: 'Ei maa', english: 'This is mother.' },
  { type: 'word', bengali: 'এই মা ভালো', transliteration: 'Ei maa bhalo', english: 'This mother is good.' },
  { type: 'word', bengali: 'এই মা ভালো না', transliteration: 'Ei maa bhalo na', english: 'This mother is not good.' },
  { type: 'word', bengali: 'ওই বাবা', transliteration: 'Oi baba', english: 'That is father.' },
  { type: 'word', bengali: 'ওই বাবা ভালো', transliteration: 'Oi baba bhalo', english: 'That father is good.' },
  { type: 'word', bengali: 'ওই বাবা ভালো না', transliteration: 'Oi baba bhalo na', english: 'That father is not good.' },
]

export default function ModulePage({
  phaseIndex,
  moduleIndex,
  phaseTitle: _phaseTitle,
  moduleTitle,
  onHomeClick,
  onModuleComplete,
}: ModulePageProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isLoadingAudio, setIsLoadingAudio] = useState(false)
  const [isExtendedVocabulary, setIsExtendedVocabulary] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const currentExercises = isExtendedVocabulary ? extendedExercises : exercises
  const currentItem = currentExercises[currentIndex]

  // Safety check - if currentItem doesn't exist, don't render content
  if (!currentItem) {
    return (
      <div className="module-page">
        <div className="module-header">
          <button className="home-link" onClick={onHomeClick}>
            Home
          </button>
          <div className="breadcrumb">
            Phase {phaseIndex + 1} &gt; Module {moduleIndex + 1}
          </div>
        </div>
        <div className="module-content">
          <h1 className="module-title">{moduleTitle}</h1>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  const handleNext = () => {
    if (isExtendedVocabulary) {
      if (currentIndex < extendedExercises.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setIsFlipped(false)
      }
    } else {
      if (currentIndex < exercises.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setIsFlipped(false)
      } else {
        // Move to extended vocabulary
        setIsExtendedVocabulary(true)
        setCurrentIndex(0)
        setIsFlipped(false)
      }
    }
  }

  const handlePrev = () => {
    if (isExtendedVocabulary) {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1)
        setIsFlipped(false)
      } else {
        // Go back to main exercises
        setIsExtendedVocabulary(false)
        setCurrentIndex(exercises.length - 1)
        setIsFlipped(false)
      }
    } else {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1)
        setIsFlipped(false)
      }
    }
  }

  const handleCardFlip = () => {
    // #region agent log
    const containerEl = document.querySelector('.flashcard-container') as HTMLElement;
    const cardEl = document.querySelector('.flashcard') as HTMLElement;
    const frontEl = document.querySelector('.flashcard-front') as HTMLElement;
    const backEl = document.querySelector('.flashcard-back') as HTMLElement;
    if (containerEl && cardEl && frontEl && backEl) {
      const containerRect = containerEl.getBoundingClientRect();
      const cardRect = cardEl.getBoundingClientRect();
      const frontRect = frontEl.getBoundingClientRect();
      const backRect = backEl.getBoundingClientRect();
      fetch('http://127.0.0.1:7243/ingest/527e3b5a-98c0-4af5-b0e2-4573bffa1504',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ModulePage.tsx:62',message:'BEFORE flip - positions and dimensions',data:{isFlipped,container:{top:containerRect.top,left:containerRect.left,width:containerRect.width,height:containerRect.height},card:{top:cardRect.top,left:cardRect.left,width:cardRect.width,height:cardRect.height,transform:getComputedStyle(cardEl).transform},front:{top:frontRect.top,left:frontRect.left,width:frontRect.width,height:frontRect.height},back:{top:backRect.top,left:backRect.left,width:backRect.width,height:backRect.height}},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C'})}).catch(()=>{});
    }
    // #endregion
    setIsFlipped(!isFlipped)
  }

  // #region agent log
  useEffect(() => {
    const containerEl = document.querySelector('.flashcard-container') as HTMLElement;
    const cardEl = document.querySelector('.flashcard') as HTMLElement;
    const frontEl = document.querySelector('.flashcard-front') as HTMLElement;
    const backEl = document.querySelector('.flashcard-back') as HTMLElement;
    if (containerEl && cardEl && frontEl && backEl) {
      setTimeout(() => {
        const containerRect = containerEl.getBoundingClientRect();
        const cardRect = cardEl.getBoundingClientRect();
        const frontRect = frontEl.getBoundingClientRect();
        const backRect = backEl.getBoundingClientRect();
        fetch('http://127.0.0.1:7243/ingest/527e3b5a-98c0-4af5-b0e2-4573bffa1504',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ModulePage.tsx:useEffect',message:'AFTER flip state change - positions and dimensions',data:{isFlipped,container:{top:containerRect.top,left:containerRect.left,width:containerRect.width,height:containerRect.height},card:{top:cardRect.top,left:cardRect.left,width:cardRect.width,height:cardRect.height,transform:getComputedStyle(cardEl).transform},front:{top:frontRect.top,left:frontRect.left,width:frontRect.width,height:frontRect.height},back:{top:backRect.top,left:backRect.left,width:backRect.width,height:backRect.height}},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C'})}).catch(()=>{});
      }, 100);
    }
  }, [isFlipped, currentIndex]);
  // #endregion

  const handleFinish = () => {
    if (onModuleComplete) {
      onModuleComplete(phaseIndex, moduleIndex)
    }
    onHomeClick()
  }

  const isLastExercise = isExtendedVocabulary && currentIndex === extendedExercises.length - 1

  const handleSpeak = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card flip when clicking speaker
    
    const textToSpeak = currentItem.bengali
    
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    setIsLoadingAudio(true)
    
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textToSpeak }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate speech')
      }

      const data = await response.json()
      const audio = new Audio(data.audioDataUri)
      audioRef.current = audio
      
      audio.onended = () => {
        setIsLoadingAudio(false)
      }
      
      audio.onerror = () => {
        setIsLoadingAudio(false)
      }
      
      await audio.play()
    } catch (error) {
      console.error('Error playing audio:', error)
      setIsLoadingAudio(false)
      alert('Failed to play audio. Please make sure the server is running.')
    }
  }

  // Only show Phase 1, Module 1 content
  const isPhase1Module1 = phaseIndex === 0 && moduleIndex === 0

  return (
    <div className="module-page">
      <div className="module-header">
        <button className="home-link" onClick={onHomeClick}>
          Home
        </button>
        <div className="breadcrumb">
          Phase {phaseIndex + 1} &gt; Module {moduleIndex + 1}
        </div>
      </div>
      <div className="module-content">
        <h1 className="module-title">{moduleTitle}</h1>
        
        {isPhase1Module1 && (
          <>
            <h2 className="sub-header">
              {isExtendedVocabulary ? 'Extended Vocabulary' : 'Vocabulary & Phonics'}
            </h2>
            <p className="explanatory-text">
              {isExtendedVocabulary 
                ? "Here are some excellent vocabulary words and exercises that logically extend the material and build toward the content in later modules."
                : currentIndex >= 6 
                  ? "Bengali script distinguishes between short and long vowels (e.g., hroshwo-i and dirgho-i), but in modern colloquial speech, the length difference is negligible."
                  : "In Bengali, consonants carry an inherent vowel sound, typically pronounced as a rounded 'aw' (like \"hot\" or \"ball\"). This is represented in transliteration as 'o' or 'ô'."
              }
            </p>

            {/* Exercise Display */}
            {currentItem.type === 'letter' ? (
              <div className="letter-section">
                <div className="letter-display">
                  <div className="bengali-letter">{currentItem.bengali}</div>
                  <div className="transliteration">{currentItem.transliteration}</div>
                  <button 
                    className="speaker-button" 
                    aria-label="Play pronunciation"
                    onClick={handleSpeak}
                    disabled={isLoadingAudio}
                  >
                    {isLoadingAudio ? (
                      <Loader2 size={24} className="spinner" />
                    ) : (
                      <Volume2 size={24} />
                    )}
                  </button>
                </div>
                <div className="navigation-buttons">
                  {currentIndex > 0 && (
                    <button className="back-button" onClick={handlePrev}>
                      Back
                    </button>
                  )}
                  {!isLastExercise && currentIndex < currentExercises.length - 1 && (
                    <button className="next-button" onClick={handleNext}>
                      Next
                    </button>
                  )}
                  {!isExtendedVocabulary && currentIndex === exercises.length - 1 && (
                    <button className="next-button" onClick={handleNext}>
                      Next
                    </button>
                  )}
                  {isLastExercise && (
                    <button className="finish-button" onClick={handleFinish}>
                      Finish
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flashcards-section">
                <div className="flashcard-container" data-testid="flashcard-container">
                  <div className="flashcard-content">
                    {!isFlipped ? (
                      <div className="flashcard-front">
                        <div className="flashcard-bengali">{currentItem.bengali}</div>
                        <div className="flashcard-transliteration">{currentItem.transliteration}</div>
                        <button 
                          className="flashcard-speaker-button" 
                          aria-label="Play pronunciation"
                          onClick={handleSpeak}
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
                          onClick={handleCardFlip}
                          aria-label="Show English translation"
                        >
                          <ChevronRight size={24} />
                        </button>
                      </div>
                    ) : (
                      <div className="flashcard-back">
                        <div className="flashcard-english">{currentItem.english}</div>
                        <button 
                          className="flashcard-speaker-button" 
                          aria-label="Play pronunciation"
                          onClick={handleSpeak}
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
                          onClick={handleCardFlip}
                          aria-label="Show Bengali version"
                        >
                          <ChevronLeft size={24} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="navigation-buttons">
                  {currentIndex > 0 && (
                    <button className="back-button" onClick={handlePrev}>
                      Back
                    </button>
                  )}
                  {!isLastExercise && currentIndex < currentExercises.length - 1 && (
                    <button className="next-button" onClick={handleNext}>
                      Next
                    </button>
                  )}
                  {!isExtendedVocabulary && currentIndex === exercises.length - 1 && (
                    <button className="next-button" onClick={handleNext}>
                      Next
                    </button>
                  )}
                  {isLastExercise && (
                    <button className="finish-button" onClick={handleFinish}>
                      Finish
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

