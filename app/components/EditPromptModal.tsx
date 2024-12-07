'use client'

import React, { useState } from 'react'
import { Platform } from '../types'
import LoadingSpinner from './LoadingSpinner'

interface Props {
  platform: Platform
  initialPrompt: string
  isRegenerating: boolean
  error: string | null
  onSubmit: (prompt: string) => Promise<void>
  onClose: () => void
}

export default function EditPromptModal({ 
  platform, 
  initialPrompt,
  isRegenerating,
  error,
  onSubmit, 
  onClose 
}: Props) {
  const [prompt, setPrompt] = useState(initialPrompt)
  const [validationError, setValidationError] = useState<string | null>(null)

  const validatePrompt = (prompt: string): boolean => {
    if (!prompt.trim()) {
      setValidationError('Prompt cannot be empty')
      return false
    }
    
    if (!prompt.includes('"content"') || !prompt.includes('"hashtags"')) {
      setValidationError('Prompt must include requirements for "content" and "hashtags" in JSON format')
      return false
    }
    
    setValidationError(null)
    return true
  }

  const handleSubmit = async () => {
    if (!validatePrompt(prompt)) return
    await onSubmit(prompt)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-lg p-6 max-w-2xl w-full space-y-4 border border-border">
        <h2 className="text-xl font-semibold text-text">Edit Prompt Template</h2>
        <div className="space-y-2">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isRegenerating}
            className="w-full h-64 bg-surface text-text rounded-lg p-3 border border-border focus:ring-1 focus:ring-primary focus:outline-none disabled:opacity-50"
          />
          {(validationError || error) && (
            <p className="text-red-500 text-sm">{validationError || error}</p>
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            disabled={isRegenerating}
            className="px-4 py-2 bg-surface text-text-secondary rounded hover:bg-surface/80 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isRegenerating}
            className="px-4 py-2 bg-primary text-text rounded hover:bg-primary/90 disabled:opacity-50 flex items-center space-x-2"
          >
            {isRegenerating ? (
              <>
                <LoadingSpinner />
                <span>Regenerating...</span>
              </>
            ) : (
              'Save & Regenerate'
            )}
          </button>
        </div>
      </div>
    </div>
  )
} 