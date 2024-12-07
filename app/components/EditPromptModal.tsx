'use client'

import React, { useState } from 'react'
import { Platform } from '../types'
import { PLATFORM_PROMPTS } from '../lib/openai'

interface Props {
  platform: Platform
  onSubmit: (prompt: string) => Promise<void>
  onClose: () => void
}

export default function EditPromptModal({ platform, onSubmit, onClose }: Props) {
  const [prompt, setPrompt] = useState(PLATFORM_PROMPTS[platform])

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg p-6 max-w-2xl w-full space-y-4 border border-border">
        <h2 className="text-xl font-semibold text-text">Edit Prompt Template</h2>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full h-64 bg-surface text-text rounded-lg p-3 border border-border focus:ring-1 focus:ring-primary focus:outline-none"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-surface text-text-secondary rounded hover:bg-surface/80"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(prompt)}
            className="px-4 py-2 bg-primary text-text rounded hover:bg-primary/90"
          >
            Save & Regenerate
          </button>
        </div>
      </div>
    </div>
  )
} 