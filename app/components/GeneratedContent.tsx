'use client'
import React, { useState } from 'react'
import { GeneratedContent as GeneratedContentType, Platform } from '../types'
import EditPromptModal from './EditPromptModal'

interface Props {
  platform: Platform
  content: GeneratedContentType
  onPromptEdit: (platform: Platform, prompt: string) => Promise<void>
}

export default function GeneratedContent({ platform, content, onPromptEdit }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(content.content)
  const [showPromptModal, setShowPromptModal] = useState(false)

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
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full h-32 bg-surface text-text rounded-lg p-3 border border-border focus:ring-1 focus:ring-primary focus:outline-none"
        />
        <div className="flex flex-wrap gap-2">
          {content.hashtags.map((tag) => (
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
          onSubmit={async (prompt: string) => {
            await onPromptEdit(platform, prompt)
            setShowPromptModal(false)
          }}
          onClose={() => setShowPromptModal(false)}
        />
      )}
    </div>
  )
} 