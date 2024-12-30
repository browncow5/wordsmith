'use client'

import { useState } from 'react'
import GameSetup from './components/GameSetup'
import GameVisualization from './components/GameVisualization'
import GuessSubmission from './components/GuessSubmission'
import { Button } from '@/components/ui/button'

interface Guess {
  text: string
  wasCorrect: boolean
}

export default function WordGuessingGame() {
  const [wordList, setWordList] = useState<string[]>([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [guesses, setGuesses] = useState<Guess[]>([])
  const [gameStarted, setGameStarted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [totalGuesses, setTotalGuesses] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)

  const startNewGame = async (rootWord: string, length: number) => {
    setIsLoading(true)
    setError(null)
    setRevealed(false)
    try {
      const response = await fetch(`/api/get-word-list?rootWord=${rootWord}&length=${length}`)
      if (!response.ok) {
        throw new Error('Failed to fetch word list')
      }
      const data = await response.json()
      setWordList(data.wordList)
      setCurrentWordIndex(0)
      setGuesses([])
      setGameStarted(true)
      setTotalGuesses(0)
    } catch (err) {
      setError('Failed to start a new game. Please try again.')
      console.error('Error starting new game:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const endGame = () => {
    setGameStarted(false)
    setWordList([])
    setCurrentWordIndex(0)
    setGuesses([])
    setError(null)
    setRevealed(false)
  }

  const submitGuess = (guess: string) => {
    const isCorrect = guess.toLowerCase() === wordList[currentWordIndex + 1]?.toLowerCase()
    setGuesses(prev => [...prev, { text: guess, wasCorrect: isCorrect }])
    setTotalGuesses(prev => prev + 1)
    if (isCorrect) {
      setCurrentWordIndex(prev => prev + 1)
    }
  }

  const handleReveal = () => {
    setRevealed(true)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Word Guessing Game</h1>
      <GameSetup 
        onNewGame={startNewGame} 
        onEndGame={endGame} 
        gameStarted={gameStarted}
        isLoading={isLoading}
        totalGuesses={totalGuesses}
      />
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {gameStarted && (
        <>
          <GameVisualization 
            wordList={wordList} 
            currentWordIndex={currentWordIndex}
            revealed={revealed}
          />
          <GuessSubmission 
            onSubmitGuess={submitGuess} 
            guesses={guesses} 
            wordList={wordList}
            currentWordIndex={currentWordIndex}
          />
          <Button onClick={handleReveal} disabled={revealed} className="mt-4">
            Reveal Words
          </Button>
        </>
      )}
    </div>
  )
}

