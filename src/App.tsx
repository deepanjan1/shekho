import { useState } from 'react'
import './App.css'
import ModulePage from './ModulePage'

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

type View = 'home' | { phaseIndex: number; moduleIndex: number }

function App() {
  const [expandedPhases, setExpandedPhases] = useState<Set<number>>(new Set())
  const [currentView, setCurrentView] = useState<View>('home')

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
    // Only Phase 1, Module 1 is clickable
    if (phaseIndex === 0 && moduleIndex === 0) {
      setCurrentView({ phaseIndex, moduleIndex })
    }
  }

  const handleHomeClick = () => {
    setCurrentView('home')
  }

  // If we're viewing a module, show the module page
  if (currentView !== 'home') {
    const { phaseIndex, moduleIndex } = currentView
    const phase = phases[phaseIndex]
    // Use specific title for Phase 1, Module 1 as requested
    const moduleTitle = phaseIndex === 0 && moduleIndex === 0
      ? 'The Soundscape of Bengali - Vowel and Phonics'
      : phase.modules[moduleIndex].replace(/^Module \d+: /, '')
    
    return (
      <ModulePage
        phaseIndex={phaseIndex}
        moduleIndex={moduleIndex}
        phaseTitle={phase.title}
        moduleTitle={moduleTitle}
        onHomeClick={handleHomeClick}
      />
    )
  }

  return (
    <div className="app">
      <header className="header">
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
                  const isClickable = index === 0 && moduleIndex === 0
                  return (
                    <div
                      key={moduleIndex}
                      className={isClickable ? 'module-item clickable' : 'module-item'}
                      onClick={() => handleModuleClick(index, moduleIndex)}
                    >
                      {!isClickable && <span className="lock-icon">🔒</span>}
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
