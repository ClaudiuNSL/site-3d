'use client'

import { useState, useRef, useEffect } from 'react'

interface EmojiSelectorProps {
  value?: string
  onChange: (emoji: string) => void
  label?: string
}

const EMOJI_CATEGORIES = [
  {
    name: 'Evenimente',
    emojis: [
      { emoji: '💍', label: 'Nuntă' },
      { emoji: '💒', label: 'Ceremonie' },
      { emoji: '👰', label: 'Mireasă' },
      { emoji: '🤵', label: 'Mire' },
      { emoji: '💐', label: 'Buchet' },
      { emoji: '🥂', label: 'Toast' },
      { emoji: '🎂', label: 'Tort' },
      { emoji: '👶', label: 'Botez' },
      { emoji: '🍼', label: 'Bebeluș' },
      { emoji: '🎓', label: 'Absolvire' },
      { emoji: '🎉', label: 'Petrecere' },
      { emoji: '🎈', label: 'Aniversare' },
    ]
  },
  {
    name: 'Fotografie',
    emojis: [
      { emoji: '📸', label: 'Fotografie' },
      { emoji: '🎬', label: 'Video' },
      { emoji: '🖼️', label: 'Portret' },
      { emoji: '🌅', label: 'Peisaj' },
      { emoji: '🏛️', label: 'Arhitectură' },
      { emoji: '🌺', label: 'Natură' },
      { emoji: '✨', label: 'Studio' },
      { emoji: '🎭', label: 'Artistic' },
    ]
  },
  {
    name: 'Familie & Cuplu',
    emojis: [
      { emoji: '💑', label: 'Cuplu' },
      { emoji: '👨‍👩‍👧‍👦', label: 'Familie' },
      { emoji: '❤️', label: 'Dragoste' },
      { emoji: '💕', label: 'Inimi' },
      { emoji: '🤰', label: 'Maternitate' },
      { emoji: '👪', label: 'Grup familial' },
    ]
  },
  {
    name: 'Locații',
    emojis: [
      { emoji: '🏖️', label: 'Plajă' },
      { emoji: '🏔️', label: 'Munte' },
      { emoji: '🌳', label: 'Parc' },
      { emoji: '🏰', label: 'Castel' },
      { emoji: '⛪', label: 'Biserică' },
      { emoji: '🌃', label: 'Oraș' },
    ]
  },
  {
    name: 'Business',
    emojis: [
      { emoji: '💼', label: 'Corporate' },
      { emoji: '🏢', label: 'Birou' },
      { emoji: '📋', label: 'Eveniment corp.' },
      { emoji: '🎤', label: 'Conferință' },
      { emoji: '🏆', label: 'Premii' },
      { emoji: '🤝', label: 'Parteneriat' },
    ]
  },
]

// Flat list for lookups
const ALL_EMOJIS = EMOJI_CATEGORIES.flatMap(cat => cat.emojis)

export default function EmojiSelector({ value, onChange, label = 'Icon (Emoji)' }: EmojiSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setSearch('')
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      setTimeout(() => searchRef.current?.focus(), 50)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handleSelect = (emoji: string) => {
    onChange(emoji)
    setIsOpen(false)
    setSearch('')
  }

  const selectedLabel = ALL_EMOJIS.find(opt => opt.emoji === value)?.label

  // Filter by search
  const filteredCategories = search.trim()
    ? EMOJI_CATEGORIES.map(cat => ({
        ...cat,
        emojis: cat.emojis.filter(e =>
          e.label.toLowerCase().includes(search.toLowerCase())
        )
      })).filter(cat => cat.emojis.length > 0)
    : EMOJI_CATEGORIES

  return (
    <div ref={containerRef}>
      <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">
        {label}
      </label>

      <div className="relative">
        {/* Trigger button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full px-3.5 py-2.5 text-left rounded-lg transition-all duration-200
            bg-white/[0.04] border hover:bg-white/[0.06]
            focus:outline-none focus:border-[#fbbf24]/40 focus:ring-1 focus:ring-[#fbbf24]/20
            ${isOpen ? 'border-[#fbbf24]/40 ring-1 ring-[#fbbf24]/20' : 'border-white/[0.08]'}
          `}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {value ? (
                <>
                  <span className="text-2xl leading-none">{value}</span>
                  <span className="text-white/70 text-sm">{selectedLabel || 'Selectat'}</span>
                </>
              ) : (
                <span className="text-white/25 text-sm">Alege un emoji...</span>
              )}
            </div>
            <i className={`fas fa-chevron-down text-[10px] text-white/20 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}></i>
          </div>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-30 mt-2 w-full bg-[#151515] border border-white/[0.1] rounded-xl shadow-2xl shadow-black/40 overflow-hidden">
            {/* Search */}
            <div className="p-2.5 border-b border-white/[0.06]">
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-white/20"></i>
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Caută emoji..."
                  className="w-full pl-8 pr-3 py-2 bg-white/[0.04] border border-white/[0.06] rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/[0.12]"
                />
              </div>
            </div>

            {/* Emoji grid by category */}
            <div className="max-h-72 overflow-y-auto overscroll-contain p-1.5" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
              {filteredCategories.length === 0 ? (
                <div className="text-center py-6 text-white/25 text-sm">Niciun rezultat</div>
              ) : (
                filteredCategories.map((category) => (
                  <div key={category.name} className="mb-1">
                    <div className="px-2 py-1.5 text-[10px] font-medium text-white/25 uppercase tracking-widest">
                      {category.name}
                    </div>
                    <div className="grid grid-cols-4 gap-0.5">
                      {category.emojis.map((option) => (
                        <button
                          key={option.emoji}
                          type="button"
                          onClick={() => handleSelect(option.emoji)}
                          className={`
                            flex flex-col items-center justify-center py-2.5 px-1 rounded-lg transition-all duration-150 group
                            ${value === option.emoji
                              ? 'bg-[#fbbf24]/10 ring-1 ring-[#fbbf24]/30'
                              : 'hover:bg-white/[0.06]'
                            }
                          `}
                          title={option.label}
                        >
                          <span className="text-xl mb-0.5 group-hover:scale-110 transition-transform duration-150">
                            {option.emoji}
                          </span>
                          <span className={`text-[9px] text-center leading-tight line-clamp-1 ${
                            value === option.emoji ? 'text-[#fbbf24]/70' : 'text-white/25'
                          }`}>
                            {option.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Clear button */}
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="mt-2 text-xs text-white/30 hover:text-red-400/80 transition-colors flex items-center gap-1.5"
        >
          <i className="fas fa-times text-[8px]"></i>
          Șterge selecția
        </button>
      )}
    </div>
  )
}
