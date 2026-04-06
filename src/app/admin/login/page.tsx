// 'use client' spune lui Next.js că acest fișier rulează în browser
'use client'

// signIn = funcția din next-auth care trimite datele de login la server pentru autentificare
import { signIn } from 'next-auth/react'
// useRouter = ne permite să redirecționăm utilizatorul la altă pagină
import { useRouter } from 'next/navigation'
// useState = hook React pentru a stoca date care se pot schimba (variabile reactive)
import { useState } from 'react'
// Importăm fișierul CSS cu stilurile specifice paginii de login
import './login.css'

// =============================================================================
// Componenta AdminLogin - Pagina de autentificare (login) pentru admin
// Aici utilizatorul introduce email-ul și parola pentru a se conecta
// =============================================================================
export default function AdminLogin() {
  // Stocăm email-ul introdus de utilizator în câmpul de email
  const [email, setEmail] = useState('')
  // Stocăm parola introdusă de utilizator în câmpul de parolă
  const [password, setPassword] = useState('')
  // Stocăm mesajul de eroare (gol = nicio eroare)
  const [error, setError] = useState('')
  // Indică dacă formularul se trimite (true = se procesează, false = gata)
  const [isLoading, setIsLoading] = useState(false)
  // Stocăm care câmp este selectat/activ (focused) - 'email', 'password' sau null
  // Folosit pentru a adăuga efecte vizuale când utilizatorul dă click pe un câmp
  const [focused, setFocused] = useState<string | null>(null)
  // router = ne permite să navigăm la altă pagină după login
  const router = useRouter()

  // ==========================================================================
  // handleSubmit - Funcția care se execută când utilizatorul trimite formularul
  // async = funcție asincronă (așteaptă răspunsul de la server)
  // e: React.FormEvent = evenimentul de submit al formularului
  // ==========================================================================
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevenim comportamentul implicit al formularului (reîncărcarea paginii)
    e.preventDefault()
    // Activăm starea de încărcare (afișăm spinner-ul pe buton)
    setIsLoading(true)
    // Resetăm mesajul de eroare anterior
    setError('')

    try {
      // Trimitem cererea de autentificare la server cu email-ul și parola
      // signIn('credentials', ...) folosește strategia de autentificare cu email+parolă
      // redirect: false = nu redirecționa automat, noi vom gestiona redirecționarea
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      // Dacă serverul a returnat o eroare (email/parolă greșite)
      if (result?.error) {
        setError('Email sau parola greșite')
      } else {
        // Autentificare reușită! Redirecționăm la dashboard
        router.push('/admin/dashboard')
      }
    } catch {
      // Dacă a apărut o eroare de rețea sau alta
      setError('A apărut o eroare. Încercați din nou.')
    } finally {
      // finally se execută ÎNTOTDEAUNA (fie succes, fie eroare)
      // Dezactivăm starea de încărcare
      setIsLoading(false)
    }
  }

  // ==========================================================================
  // Randarea paginii de login - are două panouri: vizual (stânga) și formular (dreapta)
  // ==========================================================================
  return (
    // Container-ul principal al paginii de login
    <div className="login-page">
      {/* ================================================================== */}
      {/* Panoul vizual din stânga - decorativ, cu efecte grafice */}
      {/* ================================================================== */}
      <div className="login-visual">
        {/* Efect de lumină ambientală pe fundal */}
        <div className="login-ambient"></div>

        {/* Particule bokeh - cercuri decorative animate care plutesc pe ecran */}
        {/* Bokeh = efect fotografie (cercuri de lumină nefocalizate) */}
        <div className="bokeh-field">
          {/* Creăm 18 particule bokeh folosind Array.from */}
          {/* Array.from({ length: 18 }) creează un array cu 18 elemente */}
          {/* .map() creează câte un element <div> pentru fiecare particulă */}
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className={`bokeh bokeh-${i + 1}`}></div>
          ))}
        </div>

        {/* Graficul aperturii - element decorativ care imită diafragma unei camere foto */}
        <div className="aperture-wrap">
          <div className="aperture">
            {/* Creăm 7 "lame" ale diafragmei, fiecare rotită diferit */}
            {/* --i = variabilă CSS personalizată folosită pentru rotația fiecărei lame */}
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="aperture-blade" style={{ '--i': i } as React.CSSProperties}></div>
            ))}
          </div>
          {/* Inele decorative în jurul aperturii */}
          <div className="aperture-ring"></div>
          <div className="aperture-ring aperture-ring-2"></div>
          {/* Efect de strălucire */}
          <div className="aperture-glow"></div>
        </div>

        {/* Textul brand-ului pe panoul vizual */}
        <div className="login-visual-brand">
          {/* Logo-ul cu inițialele "BC" */}
          <div className="login-visual-logo">BC</div>
          {/* Linie decorativă */}
          <div className="login-visual-line"></div>
          {/* Sloganul fotografului */}
          <p className="login-visual-tagline">Surprind momente,<br/>creez amintiri</p>
        </div>

        {/* Linii de grilă decorative */}
        <div className="login-grid-lines">
          <div className="grid-line grid-line-h"></div>
          <div className="grid-line grid-line-v"></div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* Panoul formularului din dreapta - aici utilizatorul se autentifică */}
      {/* ================================================================== */}
      <div className="login-form-panel">
        <div className="login-form-inner">
          {/* Element decorativ în colțul de sus */}
          <div className="login-corner-accent"></div>

          {/* Header-ul formularului - titlu și descriere */}
          <div className="login-form-header">
            {/* Eticheta "Admin Panel" */}
            <span className="login-label">Admin Panel</span>
            {/* Titlul principal */}
            <h1 className="login-title">Bine ai<br/>revenit</h1>
            {/* Descrierea sub titlu */}
            <p className="login-desc">Conectează-te pentru a gestiona portofoliul</p>
          </div>

          {/* Formularul de login - onSubmit se execută când se apasă butonul sau Enter */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* Mesajul de eroare - se afișează doar dacă variabila error NU este goală */}
            {/* && = "dacă condiția din stânga e true, afișează ce e în dreapta" */}
            {error && (
              <div className="login-error">
                {/* Iconița de eroare (SVG = imagine vectorială desenată cu cod) */}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 4.5v4M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                {/* Textul erorii */}
                <span>{error}</span>
              </div>
            )}

            {/* Câmpul de email */}
            {/* Clasele CSS se schimbă dinamic: dacă câmpul e selectat (focused) sau are text (filled) */}
            <div className={`login-field ${focused === 'email' ? 'login-field-focus' : ''} ${email ? 'login-field-filled' : ''}`}>
              {/* Eticheta câmpului */}
              <label htmlFor="email">Email</label>
              <div className="login-input-wrap">
                {/* Iconița de email (plic) */}
                <svg className="login-field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="4" width="20" height="16" rx="3"/>
                  <path d="M2 7l10 6 10-6"/>
                </svg>
                {/* Câmpul de input pentru email */}
                {/* value={email} = valoarea afișată vine din state */}
                {/* onChange = când utilizatorul tastează, actualizăm state-ul */}
                {/* onFocus = când dă click pe câmp, setăm focused='email' */}
                {/* onBlur = când părăsește câmpul, setăm focused=null */}
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
              {/* Linie decorativă sub câmp */}
              <div className="login-field-line"></div>
            </div>

            {/* Câmpul de parolă - funcționează la fel ca cel de email */}
            <div className={`login-field ${focused === 'password' ? 'login-field-focus' : ''} ${password ? 'login-field-filled' : ''}`}>
              <label htmlFor="password">Parolă</label>
              <div className="login-input-wrap">
                {/* Iconița de lacăt */}
                <svg className="login-field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="3"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                  <circle cx="12" cy="16.5" r="1.5"/>
                </svg>
                {/* type="password" ascunde textul introdus (afișează puncte) */}
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

            {/* Butonul de submit (trimitere) */}
            {/* disabled={isLoading} = butonul e dezactivat cât timp se procesează */}
            <button
              type="submit"
              disabled={isLoading}
              className="login-submit"
            >
              {/* Textul butonului - se schimbă în funcție de starea de încărcare */}
              <span className="login-submit-text">
                {isLoading ? 'Se conectează...' : 'Conectează-te'}
              </span>
              {/* Săgeata de pe buton - vizibilă doar când NU se încarcă */}
              {!isLoading && (
                <svg className="login-submit-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6"/>
                </svg>
              )}
              {/* Spinner-ul de încărcare - vizibil doar când SE încarcă */}
              {isLoading && (
                <div className="login-spinner"></div>
              )}
              {/* Efect de strălucire decorativ pe buton */}
              <div className="login-submit-shine"></div>
            </button>
          </form>

          {/* Footer-ul paginii de login - numele fotografului */}
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
