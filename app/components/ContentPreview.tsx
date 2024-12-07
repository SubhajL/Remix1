'use client'

import React from 'react'
import { GeneratedContent } from '@/app/types'

interface Props {
  content: GeneratedContent
  platform: string
}

export default function ContentPreview({ content, platform }: Props) {
  return (
    <div className="bg-surface rounded-lg p-4 space-y-3 border border-border">
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center border border-border">
          <span className="text-lg capitalize text-text">{platform[0]}</span>
        </div>
        <div>
          <h3 className="font-medium capitalize text-text">{platform}</h3>
          <p className="text-sm text-text-secondary">Preview</p>
        </div>
      </div>
      
      <p className="text-text whitespace-pre-wrap">{content.content}</p>
      
      <div className="flex flex-wrap gap-2">
        {content.hashtags.map((tag) => (
          <span 
            key={tag}
            className="text-sm text-primary bg-primary/10 px-2 py-1 rounded"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  )
} 