'use client'

import { useState } from 'react'

interface EmojiSelectorProps {
  value?: string
  onChange: (emoji: string) => void
  label?: string
}

const EMOJI_OPTIONS = [
  { emoji: '💍', label: 'Wedding Ring' },
  { emoji: '👶', label: 'Baby' },
  { emoji: '📅', label: 'Calendar' },
  { emoji: '💑', label: 'Couple' },
  { emoji: '👨‍👩‍👧‍👦', label: 'Family' },
  { emoji: '👰', label: 'Bride' },
  { emoji: '🎓', label: 'Graduation' },
  { emoji: '💼', label: 'Briefcase' },
  { emoji: '🎭', label: 'Theater Masks' },
  { emoji: '📸', label: 'Camera' },
  { emoji: '🎉', label: 'Party' },
  { emoji: '🎂', label: 'Cake' },
  { emoji: '🌟', label: 'Star' },
  { emoji: '💐', label: 'Bouquet' },
  { emoji: '🎈', label: 'Balloon' },
  { emoji: '🎁', label: 'Gift' },
  { emoji: '❤️', label: 'Heart' },
  { emoji: '💕', label: 'Two Hearts' },
  { emoji: '🏖️', label: 'Beach' },
  { emoji: '🌸', label: 'Flower' },
]

export default function EmojiSelector({ value, onChange, label = 'Icon (Emoji)' }: EmojiSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (emoji: string) => {
    onChange(emoji)
    setIsOpen(false)
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 text-left border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        >
          <div className="flex items-center gap-3">
            {value ? (
              <>
                <span className="text-3xl">{value}</span>
                <span className="text-gray-600">
                  {EMOJI_OPTIONS.find(opt => opt.emoji === value)?.label || 'Selected'}
                </span>
              </>
            ) : (
              <span className="text-gray-400">Select an emoji...</span>
            )}
          </div>
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute z-20 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
              <div className="grid grid-cols-4 gap-1 p-2">
                {EMOJI_OPTIONS.map((option) => (
                  <button
                    key={option.emoji}
                    type="button"
                    onClick={() => handleSelect(option.emoji)}
                    className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-blue-50 transition-colors group"
                    title={option.label}
                  >
                    <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">
                      {option.emoji}
                    </span>
                    <span className="text-xs text-gray-500 text-center line-clamp-1">
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="mt-2 text-sm text-red-600 hover:text-red-700"
        >
          Clear selection
        </button>
      )}
    </div>
  )
}

