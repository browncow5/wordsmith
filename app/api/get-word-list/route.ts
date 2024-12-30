import { NextResponse } from 'next/server'

async function generateCompoundWordList(rootWord: string, length: number): Promise<string[]> {
  const result = [rootWord, ...await recursiveCompoundSearch(rootWord, length)]
  return result
}

async function recursiveCompoundSearch(rootWord: string, length: number, currentDepth = 1): Promise<string[]> {
  if (currentDepth === length) {
    return []
  }

  const compoundWords = await findCompoundWords(rootWord, length)
  const orderedCompoundWords = compoundWords.sort((a, b) => (b[1] + b[3]) - (a[1] + a[3]))

  if (compoundWords.length === 0) {
    return []
  }

  const secondPart = orderedCompoundWords[0][2]
  return [secondPart, ...await recursiveCompoundSearch(secondPart, length, currentDepth + 1)]
}

async function findCompoundWords(rootWord: string, length: number): Promise<[string, number, string, number][]> {
  const url = `https://api.datamuse.com/words?sp=${rootWord}????*&max=8`
  const response = await fetch(url)
  const data = await response.json()
  const words = data.map((word: any) => word.word)
  const compoundWords = words.filter((word: string) => word.length > rootWord.length)

  const verifiedCompoundWords: [string, number, string, number][] = []
  for (const word of compoundWords) {
    let secondPart = word.slice(rootWord.length)
    secondPart = secondPart.trimStart().replace(/^-/, '')
    const secondPartFreq = await getWordFrequency(secondPart)
    const compoundWordFreq = await getWordFrequency(word)

    if (secondPartFreq > 1) {
      verifiedCompoundWords.push([word, compoundWordFreq, secondPart, secondPartFreq])
    }
  }

  return verifiedCompoundWords
}

async function getWordFrequency(inputWord: string): Promise<number> {
  const url = `https://api.datamuse.com/words?sp=${inputWord}&max=1&md=f`
  const response = await fetch(url)
  const data = await response.json()

  const forbiddenWords = ["ing", "a", "er", "ism", "nt", "nts"]

  if (data.length > 0) {
    if (forbiddenWords.includes(inputWord)) {
      return 0
    }
    if (data[0].word === inputWord) {
      const tags = data[0].tags || []
      for (const tag of tags) {
        if (tag.startsWith("f:")) {
          return parseFloat(tag.slice(2))
        }
      }
    }
  }
  return 0
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const rootWord = searchParams.get('rootWord') || 'light'
  const length = parseInt(searchParams.get('length') || '4', 10)

  try {
    const wordList = await generateCompoundWordList(rootWord, length)
    return NextResponse.json({ wordList })
  } catch (error) {
    console.error('Error generating word list:', error)
    return NextResponse.json({ error: 'Failed to generate word list' }, { status: 500 })
  }
}

