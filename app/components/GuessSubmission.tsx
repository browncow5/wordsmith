'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface GuessSubmissionProps {
  onSubmitGuess: (guess: string) => void
  guesses: Array<{ text: string; wasCorrect: boolean }>
  wordList: string[]
  currentWordIndex: number
}

export default function GuessSubmission({ onSubmitGuess, guesses, wordList, currentWordIndex }: GuessSubmissionProps) {
  const [currentGuess, setCurrentGuess] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentGuess.trim()) {
      onSubmitGuess(currentGuess.trim())
      setCurrentGuess('')
    }
  }

  //const isCorrectGuess = (guess: string, index: number) => {
  //  return guess.toLowerCase() === wordList[index + 1]?.toLowerCase()
  //}

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Previous Guesses:</h2>
        <div className="bg-gray-100 p-4 rounded mb-4 h-40 overflow-y-auto">
        {guesses.map((guess, index) => (
          <div 
            key={index} 
            className={guess.wasCorrect ? 'text-green-600' : 'text-red-600'}
          >
            {guess.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          value={currentGuess}
          onChange={(e) => setCurrentGuess(e.target.value)}
          placeholder="Enter your guess"
          className="flex-grow"
        />
        <Button type="submit">Submit</Button>
      </form>
    </div>
  )
}

