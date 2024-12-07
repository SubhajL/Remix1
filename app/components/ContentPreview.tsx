'use client'

import React from 'react'
import { GeneratedContent } from '@/app/types'

interface Props {
  content: GeneratedContent
  platform: string
}

export default function ContentPreview({ content, platform }: Props) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-3">
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
          <span className="text-lg capitalize">{platform[0]}</span>
        </div>
        <div>
          <h3 className="font-medium capitalize">{platform}</h3>
          <p className="text-sm text-gray-400">Preview</p>
        </div>
      </div>
      
      <p className="text-gray-200 whitespace-pre-wrap">{content.content}</p>
      
      <div className="flex flex-wrap gap-2">
        {content.hashtags.map((tag) => (
          <span 
            key={tag}
            className="text-sm text-purple-300 bg-purple-900/20 px-2 py-1 rounded"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  )
} 