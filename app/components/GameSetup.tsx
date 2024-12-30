import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'

interface GameSetupProps {
  onNewGame: (rootWord: string, length: number) => void
  onEndGame: () => void
  gameStarted: boolean
  isLoading: boolean
  totalGuesses: number
}

export default function GameSetup({ onNewGame, onEndGame, gameStarted, isLoading, totalGuesses }: GameSetupProps) {
  const [rootWord, setRootWord] = useState('light')
  const [length, setLength] = useState(4)

  const handleNewGame = () => {
    onNewGame(rootWord, length)
  }

  return (
    <div className="mb-6">
      <div className="flex items-center mb-4 gap-4">
        <Input
          type="text"
          value={rootWord}
          onChange={(e) => setRootWord(e.target.value)}
          placeholder="Starting word"
          disabled={gameStarted || isLoading}
          className="w-40"
        />
        <Input
          type="number"
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value, 10))}
          placeholder="Word list length"
          disabled={gameStarted || isLoading}
          className="w-40"
          min={2}
          max={10}
        />
        <Button onClick={handleNewGame} disabled={gameStarted || isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            'New Game'
          )}
        </Button>
        <Button onClick={onEndGame} disabled={!gameStarted} variant="destructive">
          End Game
        </Button>
      </div>
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Stats</h2>
        <p>Total Guesses: {totalGuesses}</p>
      </div>
    </div>
  )
}

