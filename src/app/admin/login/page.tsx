'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import './login.css'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Email sau parola greșite')
      } else {
        router.push('/admin/dashboard')
      }
    } catch {
      setError('A apărut o eroare. Încercați din nou.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">
      {/* Left - Visual Panel */}
      <div className="login-visual">
        {/* Ambient glow */}
        <div className="login-ambient"></div>

        {/* Bokeh particles */}
        <div className="bokeh-field">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className={`bokeh bokeh-${i + 1}`}></div>
          ))}
        </div>

        {/* Aperture graphic */}
        <div className="aperture-wrap">
          <div className="aperture">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="aperture-blade" style={{ '--i': i } as React.CSSProperties}></div>
            ))}
          </div>
          <div className="aperture-ring"></div>
          <div className="aperture-ring aperture-ring-2"></div>
          <div className="aperture-glow"></div>
        </div>

        {/* Brand text on visual side */}
        <div className="login-visual-brand">
          <div className="login-visual-logo">BC</div>
          <div className="login-visual-line"></div>
          <p className="login-visual-tagline">Surprind momente,<br/>creez amintiri</p>
        </div>

        {/* Decorative grid lines */}
        <div className="login-grid-lines">
          <div className="grid-line grid-line-h"></div>
          <div className="grid-line grid-line-v"></div>
        </div>
      </div>

      {/* Right - Form Panel */}
      <div className="login-form-panel">
        <div className="login-form-inner">
          {/* Top corner accent */}
          <div className="login-corner-accent"></div>

          <div className="login-form-header">
            <span className="login-label">Admin Panel</span>
            <h1 className="login-title">Bine ai<br/>revenit</h1>
            <p className="login-desc">Conectează-te pentru a gestiona portofoliul</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="login-error">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 4.5v4M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className={`login-field ${focused === 'email' ? 'login-field-focus' : ''} ${email ? 'login-field-filled' : ''}`}>
              <label htmlFor="email">Email</label>
              <div className="login-input-wrap">
                <svg className="login-field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="4" width="20" height="16" rx="3"/>
                  <path d="M2 7l10 6 10-6"/>
                </svg>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="admin@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                />
              </div>
              <div className="login-field-line"></div>
            </div>

            <div className={`login-field ${focused === 'password' ? 'login-field-focus' : ''} ${password ? 'login-field-filled' : ''}`}>
              <label htmlFor="password">Parolă</label>
              <div className="login-input-wrap">
                <svg className="login-field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="3"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                  <circle cx="12" cy="16.5" r="1.5"/>
                </svg>
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                />
              </div>
              <div className="login-field-line"></div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="login-submit"
            >
              <span className="login-submit-text">
                {isLoading ? 'Se conectează...' : 'Conectează-te'}
              </span>
              {!isLoading && (
                <svg className="login-submit-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6"/>
                </svg>
              )}
              {isLoading && (
                <div className="login-spinner"></div>
              )}
              <div className="login-submit-shine"></div>
            </button>
          </form>

          <div className="login-footer">
            <div className="login-footer-line"></div>
            <span>Banciu Costin Photography</span>
            <div className="login-footer-line"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
