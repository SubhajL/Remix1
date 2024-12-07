'use client'

import React, { useState } from 'react'
import { GeneratedContent as GeneratedContentType, Platform } from '@/app/types'
import EditPromptModal from './EditPromptModal'

interface Props {
  platform: Platform
  content: GeneratedContentType
  onPromptEdit: (platform: Platform, prompt: string) => Promise<void>
}

export default function GeneratedContentComponent({ platform, content, onPromptEdit }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(content.content)
  const [showPromptModal, setShowPromptModal] = useState(false)

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white capitalize">{platform}</h3>
        <div className="space-x-2">
          <button
            onClick={() => setShowPromptModal(true)}
            className="px-3 py-1 text-sm bg-gray-800 text-gray-300 rounded hover:bg-gray-700"
          >
            Edit Prompt
          </button>
          <button
            className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Publish
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full h-32 bg-gray-800 text-white rounded-lg p-3 focus:ring-1 focus:ring-purple-500 focus:outline-none"
        />
        <div className="flex flex-wrap gap-2">
          {content.hashtags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-sm"
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