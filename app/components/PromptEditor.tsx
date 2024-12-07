'use client'

import React, { useState } from 'react'
import { Platform } from '@/app/types'
import { PLATFORM_PROMPTS } from '@/app/lib/openai'

interface Props {
  platform: Platform
  onSave: (prompt: string) => Promise<void>
  defaultValue?: string
}

export default function PromptEditor({ platform, onSave, defaultValue }: Props) {
  const [prompt, setPrompt] = useState(defaultValue || PLATFORM_PROMPTS[platform])
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(prompt)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white">
          Prompt Template
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={8}
          className="w-full bg-gray-800 text-white rounded-lg p-3 focus:ring-1 focus:ring-purple-500 focus:outline-none"
        />
      </div>
      
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full rounded-lg bg-purple-500 px-4 py-2 text-white hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50"
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  )
} 