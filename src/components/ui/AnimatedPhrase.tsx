import React from 'react'
import AnimatedChar from './AnimatedChar'

interface AnimatedPhraseProps {
  phrase: string
  phraseIndex: number
  isLastPhrase: boolean
}

const AnimatedPhrase: React.FC<AnimatedPhraseProps> = ({
  phrase,
  phraseIndex,
  isLastPhrase
}) => {
  return (
    <div className="overflow-visible relative mb-2 inline-flex group">
      {/* Display text in a single line */}
      <div className="text-xl md:text-2xl lg:text-3xl orbitron-display text-white flex-nowrap whitespace-nowrap relative z-10 tracking-wider bg-gradient-to-b from-white to-white/80 bg-clip-text">
        {phrase.split('').map((char, index) => (
          <AnimatedChar 
            key={`char-${index}-${phraseIndex}`}
            char={char} 
            index={index}
          />
        ))}
      </div>
      
      {/* Add a separator after the phrase */}
      {!isLastPhrase && (
        <div className="inline-block mx-2 text-2xl md:text-3xl lg:text-4xl orbitron-accent">
          <span className="text-white/50">•</span>
        </div>
      )}
    </div>
  )
}

export default AnimatedPhrase 