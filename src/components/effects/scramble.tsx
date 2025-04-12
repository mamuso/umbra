'use client'
import React, { useState, useCallback, useRef } from 'react'

interface ScrambleProps {
  text: string
  className?: string
}

const Scramble: React.FC<ScrambleProps> = ({ text, className = '' }) => {
  const [displayText, setDisplayText] = useState(text)
  const [isAnimating, setIsAnimating] = useState(false)
  const timeoutsRef = useRef<NodeJS.Timeout[]>([])

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()'

  const easeOutQuart = (x: number): number => {
    return 1 - Math.pow(1 - x, 4)
  }

  const scrambleLetter = useCallback(
    (index: number) => {
      const originalChar = text[index]
      let scrambleCount = 0
      const maxScrambles = 3

      const getScrambleDelay = (step: number) => {
        const progress = step / maxScrambles
        const easedProgress = easeOutQuart(progress)
        return 10 + easedProgress * 20
      }

      const doScramble = () => {
        if (scrambleCount >= maxScrambles) {
          setDisplayText((current) => {
            const newText = current.split('')
            newText[index] = originalChar
            return newText.join('')
          })
          return
        }

        setDisplayText((current) => {
          const newText = current.split('')
          const randomChar = characters[Math.floor(Math.random() * characters.length)]
          newText[index] = randomChar
          return newText.join('')
        })

        scrambleCount++
        const timeout = setTimeout(doScramble, getScrambleDelay(scrambleCount))
        timeoutsRef.current.push(timeout)
      }

      doScramble()
    },
    [text, characters]
  )

  const startScramble = useCallback(() => {
    if (isAnimating) return

    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
    timeoutsRef.current = []

    setIsAnimating(true)
    setDisplayText(text)

    for (let i = 0; i < text.length; i++) {
      const timeout = setTimeout(() => {
        scrambleLetter(i)
      }, i * 15)
      timeoutsRef.current.push(timeout)
    }

    const finalDelay = setTimeout(() => {
      setIsAnimating(false)
    }, text.length * 10 + 5 * 24)
    timeoutsRef.current.push(finalDelay)
  }, [text, scrambleLetter, isAnimating])

  React.useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout))
    }
  }, [])

  return (
    <span className={`inline-block select-none transform-gpu ${className}`} onMouseEnter={startScramble}>
      {displayText}
    </span>
  )
}

export { Scramble }
