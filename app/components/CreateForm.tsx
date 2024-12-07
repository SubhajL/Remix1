'use client'

import React, { useState, ChangeEvent } from 'react'
import { Platform, PlatformContent, GeneratedContent as GeneratedContentType } from '../types'
import { PLATFORM_PROMPTS } from '../lib/openai'
import GeneratedContent from './GeneratedContent'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'

interface PlatformPrompts {
  [key: string]: string;
}

export default function CreateForm() {
  const [content, setContent] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([])
  const [generatedContent, setGeneratedContent] = useState<PlatformContent>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [platformPrompts, setPlatformPrompts] = useState<PlatformPrompts>({})

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
  }

  const handlePlatformChange = (e: ChangeEvent<HTMLInputElement>, platform: Platform) => {
    if (e.target.checked) {
      setSelectedPlatforms([...selectedPlatforms, platform])
    } else {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform))
    }
  }

  const generateContent = async (platform: Platform, customPrompt?: string) => {
    const startTime = Date.now()
    console.log(`[${platform}] Starting content generation`, {
      contentLength: content.length,
      customPrompt: !!customPrompt,
      timestamp: new Date().toISOString()
    })

    try {
      setError(null)
      const requestBody = {
        content,
        platform,
        customPrompt
      }
      
      console.log(`[${platform}] Making API request`, {
        body: requestBody,
        timestamp: new Date().toISOString()
      })

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error(`[${platform}] API error`, {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
          timestamp: new Date().toISOString()
        })
        throw new Error(`Failed to generate content: ${response.statusText}`)
      }

      const result: GeneratedContentType = await response.json()
      console.log(`[${platform}] Content generated successfully`, {
        resultLength: result.content.length,
        hashtagCount: result.hashtags.length,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString()
      })

      // Store the prompt used for this generation
      setPlatformPrompts(prev => ({
        ...prev,
        [platform]: customPrompt || PLATFORM_PROMPTS[platform]
      }))

      setGeneratedContent(prev => ({
        ...prev,
        [platform]: result
      }))
    } catch (error) {
      console.error(`[${platform}] Generation error`, {
        error,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString()
      })
      setError(error instanceof Error ? error.message : 'Failed to generate content')
    }
  }

  const handleGenerate = async () => {
    const startTime = Date.now()
    console.log('Starting batch content generation', {
      platforms: selectedPlatforms,
      contentLength: content.length,
      timestamp: new Date().toISOString()
    })

    setIsGenerating(true)
    try {
      await Promise.all(selectedPlatforms.map(platform => generateContent(platform)))
      
      console.log('Batch generation completed', {
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString()
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleContentSave = async (platform: Platform, newContent: string) => {
    setGeneratedContent(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform]!,
        content: newContent
      }
    }));
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <label 
            htmlFor="content" 
            className="block text-sm font-medium text-text"
          >
            Original Content
          </label>
          <textarea
            id="content"
            rows={6}
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Enter your content here..."
            value={content}
            onChange={handleContentChange}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-text">
            Select Platforms
          </label>
          <div className="space-y-2">
            {(['facebook', 'twitter', 'linkedin'] as Platform[]).map((platform) => (
              <label
                key={platform}
                className="flex items-center space-x-2"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-border bg-surface text-primary focus:ring-primary"
                  checked={selectedPlatforms.includes(platform)}
                  onChange={(e) => handlePlatformChange(e, platform)}
                />
                <span className="text-sm text-text-secondary capitalize">{platform}</span>
              </label>
            ))}
          </div>
        </div>

        {error && <ErrorMessage message={error} />}

        <button
          className="w-full rounded-lg bg-primary px-4 py-2 text-text hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50"
          onClick={handleGenerate}
          disabled={isGenerating || selectedPlatforms.length === 0 || !content.trim()}
        >
          {isGenerating ? 'Generating...' : 'Generate Content'}
        </button>
      </div>

      <div className="space-y-6">
        {isGenerating && <LoadingSpinner />}
        {Object.entries(generatedContent).map(([platform, content]) => (
          <GeneratedContent
            key={platform}
            platform={platform as Platform}
            content={content}
            prompt={platformPrompts[platform]}
            onPromptEdit={generateContent}
            onContentSave={handleContentSave}
          />
        ))}
      </div>
    </div>
  )
}