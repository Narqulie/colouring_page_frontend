import { useState } from 'react'
import ReactiveButton from 'reactive-button'

interface PromptFormProps {
  onSubmit: (prompt: string) => Promise<void>
  prompt: string
  setPrompt: (prompt: string) => void
}

export const PromptForm = ({ onSubmit, prompt, setPrompt }: PromptFormProps) => {
  const [buttonState, setButtonState] = useState('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setButtonState('loading')
    
    try {
      await onSubmit(prompt)
      setButtonState('success')
      
      setTimeout(() => {
        setButtonState('idle')
      }, 2000)
    } catch (error) {
      setButtonState('error')
      
      setTimeout(() => {
        setButtonState('idle')
      }, 2000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="prompt-form">
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe what you want to color! (e.g., 'a friendly dragon')"
        disabled={buttonState === 'loading'}
      />
      <ReactiveButton
        buttonState={buttonState}
        idleText="Create Coloring Page"
        loadingText="Creating..."
        successText="Created!"
        errorText="Error!"
        className="reactive-btn"
        type="submit"
        disabled={buttonState === 'loading' || !prompt.trim()}
        style={{
          width: '100%',
          padding: '0.5rem 1rem',
        }}
      />
    </form>
  )
}
