'use client'

import React from 'react'
import { usePathname } from 'next/navigation'

export default function TopBar() {
  const pathname = usePathname()
  const title = pathname === '/create' ? 'Create Content' : 'Dashboard'

  return (
    <header className="h-16 bg-black border-b border-gray-800 px-6 flex items-center">
      <h1 className="text-xl font-semibold text-white">{title}</h1>
    </header>
  )
} 