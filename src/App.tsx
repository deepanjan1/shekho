import { useState } from 'react'
import './App.css'
import ModulePage from './ModulePage'
import ConversationMode from './ConversationMode'
import ConversationLesson from './ConversationLesson'

interface Phase {
  title: string
  modules: string[]
}

const phases: Phase[] = [
  {
    title: 'Phase I: Foundations – Sound, Script, and The Self',
    modules: [
      'Module 1: The Soundscape of Bengal – Vowels and Phonics',
      'Module 2: The Architecture of Identity – Pronouns & Honorifics',
      'Module 3: The "Zero Verb" & Basic Sentences',
    ],
  },
  {
    title: 'Phase II: Action and Time – The Verb System',
    modules: [
      'Module 4: The Present Indefinite (Simple Present)',
      'Module 5: Present Continuous (Ongoing Action)',
      'Module 6: Negation and Interrogatives',
    ],
  },
  {
    title: 'Phase III: Time Travel – Past and Future Tenses',
    modules: [
      'Module 7: The Future Tense',
      'Module 8: The Simple Past Tense',
    ],
  },
  {
    title: 'Phase IV: Immersion and Context',
    modules: [
      'Module 9: The Family (Paribar)',
      'Module 10: Food and Dining (Khabar)',
      'Module 11: Imperatives and Requests',
      'Module 12: Numbers and Shopping',
      'Module 13: The Body and Feelings',
      'Module 14: Complex Sentences & Conjunctions',
      'Module 15: Idioms and Colloquialisms',
    ],
  },
]

type View = 
  | 'landing' 
  | 'grammar-home' 
  | 'conversation-mode' 
  | { phaseIndex: number; moduleIndex: number }
  | { type: 'conversation-lesson'; lessonId: number }

function App() {
  // Load from localStorage on mount
  const savedCompleted = localStorage.getItem('completedModules')
  const savedFocus = localStorage.getItem('currentFocus')
  const completedSet: Set<string> = savedCompleted ? new Set(JSON.parse(savedCompleted) as string[]) : new Set()
  
  const [expandedPhases, setExpandedPhases] = useState<Set<number>>(() => {
    // Auto-expand Phase 1 if there's progress
    if (savedCompleted || savedFocus) {
      return new Set([0])
    }
    return new Set()
  })
  const [currentView, setCurrentView] = useState<View>('landing')
  const [completedModules, setCompletedModules] = useState<Set<string>>(completedSet)
  const [currentFocus, setCurrentFocus] = useState<string>(() => {
    // Load current focus from localStorage, or find next uncompleted module
    if (savedFocus) {
      return savedFocus
    }
    // If no saved focus, find first uncompleted module
    for (let phaseIdx = 0; phaseIdx < phases.length; phaseIdx++) {
      const phase = phases[phaseIdx]
      for (let moduleIdx = 0; moduleIdx < phase.modules.length; moduleIdx++) {
        const moduleKey = `${phaseIdx}-${moduleIdx}`
        if (!completedSet.has(moduleKey)) {
          return moduleKey
        }
      }
    }
    return '0-0'
  })

  const togglePhase = (index: number) => {
    const newExpanded = new Set(expandedPhases)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedPhases(newExpanded)
  }

  const handleModuleClick = (phaseIndex: number, moduleIndex: number) => {
    // All modules are clickable
    setCurrentView({ phaseIndex, moduleIndex })
  }

  const handleConversationLessonSelect = (lessonId: number) => {
    setCurrentView({ type: 'conversation-lesson', lessonId })
  }

  const handleBackToConversationMode = () => {
    setCurrentView('conversation-mode')
  }

  const handleModuleComplete = (phaseIndex: number, moduleIndex: number) => {
    const moduleKey = `${phaseIndex}-${moduleIndex}`
    const newCompleted = new Set(completedModules)
    newCompleted.add(moduleKey)
    setCompletedModules(newCompleted)
    // Save to localStorage
    localStorage.setItem('completedModules', JSON.stringify(Array.from(newCompleted)))
    
    // Find and set the next uncompleted module as focus
    const nextModule = findNextUncompletedModule(phaseIndex, moduleIndex, newCompleted)
    if (nextModule) {
      setCurrentFocus(nextModule)
      localStorage.setItem('currentFocus', nextModule)
    }
  }

  const findNextUncompletedModule = (
    currentPhaseIndex: number,
    currentModuleIndex: number,
    completed: Set<string>
  ): string | null => {
    // First, try to find next module in the same phase
    const currentPhase = phases[currentPhaseIndex]
    for (let i = currentModuleIndex + 1; i < currentPhase.modules.length; i++) {
      const moduleKey = `${currentPhaseIndex}-${i}`
      if (!completed.has(moduleKey)) {
        return moduleKey
      }
    }
    
    // If no more modules in current phase, try next phase
    for (let phaseIdx = currentPhaseIndex + 1; phaseIdx < phases.length; phaseIdx++) {
      const phase = phases[phaseIdx]
      for (let moduleIdx = 0; moduleIdx < phase.modules.length; moduleIdx++) {
        const moduleKey = `${phaseIdx}-${moduleIdx}`
        if (!completed.has(moduleKey)) {
          return moduleKey
        }
      }
    }
    
    // All modules completed
    return null
  }

  const handleHomeClick = () => {
    setCurrentView('grammar-home')
  }

  const handleBackToLanding = () => {
    setCurrentView('landing')
  }

  // If we're viewing a module, show the module page
  if (typeof currentView === 'object' && 'phaseIndex' in currentView) {
    const { phaseIndex, moduleIndex } = currentView
    const phase = phases[phaseIndex]
    // Use specific title for Phase 1, Module 1 as requested
    const moduleTitle = phaseIndex === 0 && moduleIndex === 0
      ? 'The Soundscape of Bengali - Vowel and Phonics'
      : phase.modules[moduleIndex].replace(/^Module \d+: /, '')
    
    // Add subtitle for Phase 1, Module 2
    const moduleSubtitle = phaseIndex === 0 && moduleIndex === 1
      ? "To navigate the complex social hierarchy of Bengali pronouns. This is the single most critical module for social integration. Unlike English \"You,\" Bengali has three distinct tiers: Tui, Tumi, and Apni."
      : undefined
    
    return (
      <ModulePage
        phaseIndex={phaseIndex}
        moduleIndex={moduleIndex}
        phaseTitle={phase.title}
        moduleTitle={moduleTitle}
        moduleSubtitle={moduleSubtitle}
        onHomeClick={handleHomeClick}
        onModuleComplete={handleModuleComplete}
      />
    )
  }

  if (currentView === 'conversation-mode') {
    return (
      <ConversationMode 
        onBack={handleBackToLanding}
        onLessonSelect={handleConversationLessonSelect}
      />
    )
  }

  if (typeof currentView === 'object' && 'type' in currentView && currentView.type === 'conversation-lesson') {
    return (
      <ConversationLesson 
        lessonId={currentView.lessonId}
        onBack={handleBackToConversationMode}
      />
    )
  }

  if (currentView === 'landing') {
    return (
      <div className="app landing-page">
        <header className="header">
          <h1 className="title">Shekho</h1>
          <p className="subtitle">Learn Bengali</p>
        </header>
        <main className="main-content landing-content">
          <div className="hero-image-container">
            <img src="/animals.png" alt="Bengali Wildlife" className="hero-image" />
          </div>
          
          <div className="mode-selection">
            <button 
              className="mode-card"
              onClick={() => setCurrentView('conversation-mode')}
            >
              <h2 className="mode-title">Conversation Mode</h2>
              <p className="mode-caption">Learn Bengali through typical conversations</p>
            </button>

            <button 
              className="mode-card"
              onClick={() => setCurrentView('grammar-home')}
            >
              <h2 className="mode-title">Grammar, Vocab Mode</h2>
              <p className="mode-caption">Learn Bengali through grammar rules and slow vocab building</p>
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <button className="back-button" onClick={handleBackToLanding}>← Back</button>
        <h1 className="title">Shekho</h1>
        <p className="subtitle">Learn Bengali</p>
      </header>
      <main className="main-content">
        {phases.map((phase, index) => (
          <div key={index} className="phase-section">
            <button
              className="phase-header"
              onClick={() => togglePhase(index)}
              aria-expanded={expandedPhases.has(index)}
            >
              <span className="phase-title">{phase.title}</span>
              <span className="expand-icon">
                {expandedPhases.has(index) ? '−' : '+'}
              </span>
            </button>
            {expandedPhases.has(index) && (
              <div className="modules-container">
                {phase.modules.map((module, moduleIndex) => {
                  const moduleKey = `${index}-${moduleIndex}`
                  const isCompleted = completedModules.has(moduleKey)
                  const isCurrentFocus = moduleKey === currentFocus
                  
                  return (
                    <div
                      key={moduleIndex}
                      className={`module-item clickable ${isCurrentFocus ? 'current-focus' : ''}`}
                      onClick={() => handleModuleClick(index, moduleIndex)}
                    >
                      {isCompleted && <span className="check-icon">✓</span>}
                      {isCurrentFocus && !isCompleted && <span className="focus-indicator">→</span>}
                      {module}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </main>
    </div>
  )
}

export default App
