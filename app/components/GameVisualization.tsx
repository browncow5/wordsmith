interface GameVisualizationProps {
  wordList: string[]
  currentWordIndex: number
  revealed: boolean
}

export default function GameVisualization({ wordList, currentWordIndex, revealed }: GameVisualizationProps) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Current Words:</h2>
      <div className="bg-gray-100 p-4 rounded">
        {wordList.map((word, index) => (
          <div key={index} className="mb-2">
            {index <= currentWordIndex || revealed ? word : '****'}
          </div>
        ))}
      </div>
    </div>
  )
}

