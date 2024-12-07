'use client'

import React, { useState, useEffect } from 'react'
import { GeneratedContent as GeneratedContentType, Platform } from '../types'
import EditPromptModal from './EditPromptModal'
import LoadingSpinner from './LoadingSpinner'

interface Props {
  platform: Platform
  content: GeneratedContentType
  prompt: string
  onPromptEdit: (platform: Platform, prompt: string) => Promise<void>
  onContentSave?: (platform: Platform, content: string) => Promise<void>
}

export default function GeneratedContent({ 
  platform, 
  content: initialContent, 
  prompt,
  onPromptEdit,
  onContentSave 
}: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(initialContent.content)
  const [showPromptModal, setShowPromptModal] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [modalError, setModalError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (editedContent === initialContent.content) return;
    
    const timer = setTimeout(() => {
      handleContentSave();
    }, 1000);

    return () => clearTimeout(timer);
  }, [editedContent]);

  const handlePromptSubmit = async (newPrompt: string) => {
    const startTime = Date.now()
    console.log(`[${platform}] Starting content regeneration`, {
      promptLength: newPrompt.length,
      timestamp: new Date().toISOString()
    })

    setIsRegenerating(true)
    setModalError(null)

    try {
      await onPromptEdit(platform, newPrompt)
      console.log(`[${platform}] Content regenerated successfully`, {
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString()
      })
      setShowPromptModal(false)
    } catch (error) {
      console.error(`[${platform}] Regeneration error`, {
        error,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString()
      })
      setModalError(error instanceof Error ? error.message : 'Failed to regenerate content')
    } finally {
      setIsRegenerating(false)
    }
  }

  const handleContentSave = async () => {
    setIsSaving(true)
    setSaveError(null)
    
    try {
      const response = await fetch('/api/content/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          content: editedContent
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save content');
      }

      console.log(`[${platform}] Content saved successfully`, {
        oldLength: initialContent.content.length,
        newLength: editedContent.length,
        timestamp: new Date().toISOString()
      });

      if (onContentSave) {
        await onContentSave(platform, editedContent);
      }
    } catch (error) {
      console.error(`[${platform}] Save error`, {
        error,
        timestamp: new Date().toISOString()
      });
      setSaveError('Failed to save changes');
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-surface rounded-lg p-6 space-y-4 border border-border">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-text capitalize">{platform}</h3>
        <div className="space-x-2">
          <button
            onClick={() => setShowPromptModal(true)}
            className="px-3 py-1 text-sm bg-surface text-text-secondary rounded hover:bg-surface/80"
          >
            Edit Prompt
          </button>
          <button
            className="px-3 py-1 text-sm bg-primary text-text rounded hover:bg-primary/90"
          >
            Publish
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full h-32 bg-surface text-text rounded-lg p-3 border border-border focus:ring-1 focus:ring-primary focus:outline-none"
          />
          {isSaving && (
            <div className="absolute top-2 right-2">
              <LoadingSpinner />
            </div>
          )}
        </div>
        {saveError && (
          <p className="text-red-500 text-sm">{saveError}</p>
        )}
        <div className="flex flex-wrap gap-2">
          {initialContent.hashtags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-surface text-text-secondary rounded text-sm border border-border"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {showPromptModal && (
        <EditPromptModal
          platform={platform}
          initialPrompt={prompt}
          isRegenerating={isRegenerating}
          error={modalError}
          onSubmit={handlePromptSubmit}
          onClose={() => {
            if (!isRegenerating) {
              setShowPromptModal(false)
              setModalError(null)
            }
          }}
        />
      )}
    </div>
  )
} 