import React from 'react';
import './ConversationMode.css';

interface ConversationModeProps {
  onBack: () => void;
  onLessonSelect: (lessonId: number) => void;
}

const lessons = [
  {
    id: 1,
    title: 'Absolute Basics',
    color: '#FF6B6B',
    icon: (
      <svg viewBox="0 0 100 100" className="lesson-icon">
        <circle cx="50" cy="50" r="45" fill="#FFE3E3" />
        <path d="M30 50 L45 65 L70 35" stroke="#FF6B6B" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="50" cy="50" r="35" stroke="#FF6B6B" strokeWidth="4" fill="none" opacity="0.5"/>
      </svg>
    )
  },
  {
    id: 2,
    title: 'Daily Actions & Movement',
    color: '#4ECDC4',
    icon: (
      <svg viewBox="0 0 100 100" className="lesson-icon">
        <circle cx="50" cy="50" r="45" fill="#E0F9F7" />
        <path d="M35 70 L45 40 L65 30" stroke="#4ECDC4" strokeWidth="6" fill="none" strokeLinecap="round" />
        <circle cx="65" cy="30" r="5" fill="#4ECDC4" />
        <path d="M35 70 L55 70" stroke="#4ECDC4" strokeWidth="6" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 3,
    title: 'Food & Preferences',
    color: '#FFE66D',
    icon: (
      <svg viewBox="0 0 100 100" className="lesson-icon">
        <circle cx="50" cy="50" r="45" fill="#FFF9DB" />
        <path d="M30 60 Q50 80 70 60" stroke="#FFD93D" strokeWidth="6" fill="#FFD93D" opacity="0.8" />
        <path d="M30 60 L30 40 Q50 20 70 40 L70 60" fill="#FFD93D" opacity="0.8" />
        <path d="M45 40 L45 25" stroke="#FF9F1C" strokeWidth="4" strokeLinecap="round" />
        <path d="M55 40 L55 25" stroke="#FF9F1C" strokeWidth="4" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 4,
    title: 'Time & Routine',
    color: '#1A535C',
    icon: (
      <svg viewBox="0 0 100 100" className="lesson-icon">
        <circle cx="50" cy="50" r="45" fill="#E6EEF0" />
        <circle cx="50" cy="50" r="35" stroke="#1A535C" strokeWidth="4" fill="none" />
        <path d="M50 50 L50 25" stroke="#1A535C" strokeWidth="4" strokeLinecap="round" />
        <path d="M50 50 L70 50" stroke="#1A535C" strokeWidth="4" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 5,
    title: 'Simple Social Interaction',
    color: '#FF9F1C',
    icon: (
      <svg viewBox="0 0 100 100" className="lesson-icon">
        <circle cx="50" cy="50" r="45" fill="#FFF0D4" />
        <circle cx="35" cy="45" r="10" fill="#FF9F1C" />
        <circle cx="65" cy="45" r="10" fill="#FF9F1C" />
        <path d="M35 65 Q50 75 65 65" stroke="#FF9F1C" strokeWidth="4" fill="none" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 6,
    title: 'Polite / Soft Bengali',
    color: '#FF6B6B', // Recycling color, or pick new one like Pink
    icon: (
      <svg viewBox="0 0 100 100" className="lesson-icon">
        <circle cx="50" cy="50" r="45" fill="#FFE3E3" />
        <path d="M30 50 Q50 20 70 50 Q50 80 30 50" fill="#FF6B6B" />
      </svg>
    )
  },
  {
    id: 7,
    title: 'Emotion & Opinion',
    color: '#6A4C93',
    icon: (
      <svg viewBox="0 0 100 100" className="lesson-icon">
        <circle cx="50" cy="50" r="45" fill="#E9E2F0" />
        <path d="M30 40 Q50 30 70 40" stroke="#6A4C93" strokeWidth="4" fill="none" strokeLinecap="round" />
        <circle cx="35" cy="50" r="5" fill="#6A4C93" />
        <circle cx="65" cy="50" r="5" fill="#6A4C93" />
        <path d="M40 70 Q50 80 60 70" stroke="#6A4C93" strokeWidth="4" fill="none" strokeLinecap="round" />
      </svg>
    )
  }
];

const ConversationMode: React.FC<ConversationModeProps> = ({ onBack, onLessonSelect }) => {
  return (
    <div className="conversation-mode">
      <header className="header">
        <h1 className="title">Conversation Mode</h1>
        <p className="subtitle">Master conversational Bengali</p>
        <button className="home-button" onClick={onBack}>Home</button>
      </header>
      
      <div className="path-container">
        {lessons.map((lesson, index) => (
          <React.Fragment key={lesson.id}>
            <div 
              className="lesson-node" 
              onClick={() => onLessonSelect(lesson.id)}
              style={{ '--lesson-color': lesson.color } as React.CSSProperties}
            >
              <div className="icon-wrapper">
                {lesson.icon}
              </div>
              <div className="lesson-label">{lesson.title}</div>
            </div>
            
            {index < lessons.length - 1 && (
              <div className="path-segment">
                <svg className="dotted-line" width="20" height="60" viewBox="0 0 20 60">
                  <line x1="10" y1="0" x2="10" y2="60" stroke="#ccc" strokeWidth="4" strokeDasharray="8 8" />
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ConversationMode;
