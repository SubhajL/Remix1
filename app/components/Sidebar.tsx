'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()
  
  const navigation = [
    { name: 'Create', path: '/create' },
    { name: 'Dashboard', path: '/dashboard' },
  ]

  return (
    <aside className="w-64 bg-black text-white">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Content AI</h1>
      </div>
      <nav>
        {navigation.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`block px-6 py-3 text-lg hover:bg-gray-900 ${
              pathname === item.path ? 'text-purple-500' : 'text-gray-300'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  )
} 